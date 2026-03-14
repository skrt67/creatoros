"""Service de traitement vidéo complet."""

import asyncio
import os
import tempfile
import subprocess
import json
import re
import random
import glob
import shutil
from typing import Dict, Any, Optional
import assemblyai as aai
from prisma import Prisma
from .gemini_service import GeminiService
from . import clip_suggestions
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from youtube_transcript_api.proxies import GenericProxyConfig

# Initialize AssemblyAI
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

# Webshare proxy pool — 215 084 IPs disponibles (gopomuli-1 à gopomuli-215084)
WEBSHARE_PROXY_PASSWORD = "pa41o6pb250v"
WEBSHARE_PROXY_MAX = 215084
WEBSHARE_ENDPOINT = "p.webshare.io"
WEBSHARE_PORT = "80"


class VideoProcessor:
    def __init__(self):
        self.gemini = GeminiService()

    def get_random_proxy(self) -> str:
        """Get a random Webshare proxy URL from the full pool of 215 084 IPs."""
        n = random.randint(1, WEBSHARE_PROXY_MAX)
        return f"http://gopomuli-{n}:{WEBSHARE_PROXY_PASSWORD}@{WEBSHARE_ENDPOINT}:{WEBSHARE_PORT}"

    def extract_video_id(self, youtube_url: str) -> Optional[str]:
        """Extract video ID from various YouTube URL formats."""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\n]+)',
            r'youtube\.com\/embed\/([^&\?\n]+)',
            r'youtube\.com\/shorts\/([^&\?\n]+)'
        ]
        for pattern in patterns:
            match = re.search(pattern, youtube_url)
            if match:
                return match.group(1)
        return None

    async def process_video(self, video_id: str, youtube_url: str, job_id: str):
        """Process video asynchronously with full transcription and content generation."""
        prisma = Prisma()
        await prisma.connect()

        try:
            await prisma.videosource.update(
                where={"id": video_id},
                data={"status": "PROCESSING"}
            )

            print(f"🎬 Processing video {video_id}...")

            # Step 1: Try youtube-transcript-api (with 3 proxy retries)
            print("📝 Fetching YouTube transcript...")
            transcript_data = await self.get_youtube_transcript(youtube_url)

            # Step 2: Fallback — yt-dlp subtitle download
            if not transcript_data:
                print("ℹ️ Trying yt-dlp subtitle fallback...")
                transcript_data = await self.get_youtube_transcript_ytdlp(youtube_url)

            if not transcript_data:
                raise Exception("Could not fetch transcript from any source")

            transcript_text = transcript_data.get("text", "")
            video_title = transcript_data.get("title", "Video")

            await prisma.videosource.update(
                where={"id": video_id},
                data={"title": video_title}
            )

            print(f"📝 Transcript fetched: {len(transcript_text)} characters")
            print(f"💾 Video title saved: {video_title}")

            # Generate content using Gemini
            print("🤖 Generating content with Gemini...")
            generated_content = await self.gemini.generate_content(transcript_text)

            # Generate clip suggestions
            print("✂️ Generating viral clip suggestions...")
            try:
                clips_result = await clip_suggestions.suggest_viral_clips(
                    self.gemini.model,
                    transcript_text,
                    video_title,
                    duration_seconds=60
                )
                print(f"✅ Generated {len(clips_result.get('data', {}).get('clips', []))} clip suggestions")
            except Exception as e:
                print(f"⚠️ Clip suggestions failed: {e}")
                clips_result = None

            # Create transcript record
            await prisma.transcript.create(
                data={
                    "fullTranscript": json.dumps({"text": transcript_text, "language": transcript_data.get("language")}),
                    "jobId": job_id
                }
            )

            # Create content assets
            if generated_content:
                type_mapping = {
                    "BLOG_POST": "BLOG_POST",
                    "TWITTER_THREAD": "TWITTER_THREAD",
                    "LINKEDIN_POST": "LINKEDIN_POST",
                    "TIKTOK": "TIKTOK"
                }
                for asset_type, content in generated_content.items():
                    if asset_type == "INSTAGRAM":
                        continue
                    mapped_type = type_mapping.get(asset_type, "BLOG_POST")
                    await prisma.contentasset.create(
                        data={
                            "type": mapped_type,
                            "content": content,
                            "status": "GENERATED",
                            "jobId": job_id
                        }
                    )

            if clips_result and clips_result.get('status') == 'generated':
                await prisma.contentasset.create(
                    data={
                        "type": "CLIPS",
                        "content": json.dumps(clips_result.get('data', {})),
                        "status": "GENERATED",
                        "jobId": job_id
                    }
                )
                print(f"💾 Saved {len(clips_result.get('data', {}).get('clips', []))} clip suggestions to database")

            await prisma.processingjob.update(
                where={"id": job_id},
                data={"status": "COMPLETED"}
            )
            await prisma.videosource.update(
                where={"id": video_id},
                data={"status": "COMPLETED", "title": video_title}
            )

            print(f"✅ Video {video_id} processed successfully")

        except Exception as e:
            print(f"❌ Error processing video {video_id}: {e}")
            try:
                await prisma.processingjob.update(
                    where={"id": job_id},
                    data={"status": "FAILED"}
                )
                await prisma.videosource.update(
                    where={"id": video_id},
                    data={"status": "FAILED"}
                )
            except:
                pass
        finally:
            await prisma.disconnect()

    async def get_youtube_transcript(self, youtube_url: str) -> Optional[Dict[str, Any]]:
        """Fetch transcript from YouTube via youtube-transcript-api, retrying with 3 different proxies."""
        video_id = self.extract_video_id(youtube_url)
        if not video_id:
            print("⚠️ Could not extract video ID")
            return None

        print(f"📝 Attempting to fetch YouTube subtitles for video {video_id}...")

        for attempt in range(3):
            proxy_url = self.get_random_proxy()
            print(f"🌐 Attempt {attempt + 1}/3 — proxy: {proxy_url.split('@')[1]}")
            try:
                proxy_config = GenericProxyConfig(
                    http_url=proxy_url,
                    https_url=proxy_url
                )
                ytt_api = YouTubeTranscriptApi(proxy_config=proxy_config)
                transcript_list = ytt_api.list(video_id)

                try:
                    transcript = transcript_list.find_manually_created_transcript(['fr', 'en'])
                    print(f"✅ Found manual transcript in {transcript.language}")
                except:
                    transcript = transcript_list.find_generated_transcript(['fr', 'en'])
                    print(f"✅ Found auto-generated transcript in {transcript.language}")

                fetched = transcript.fetch()

                segments = []
                current_paragraph = []
                paragraph_start_time = 0

                for i, snippet in enumerate(fetched.snippets):
                    current_paragraph.append(snippet.text)
                    if (i + 1) % 5 == 0 or (i == len(fetched.snippets) - 1):
                        paragraph_text = " ".join(current_paragraph)
                        segments.append({
                            "text": paragraph_text,
                            "start": paragraph_start_time,
                            "duration": snippet.start + snippet.duration - paragraph_start_time if hasattr(snippet, 'start') else 0
                        })
                        current_paragraph = []
                        if hasattr(snippet, 'start'):
                            paragraph_start_time = snippet.start + snippet.duration

                full_text = "\n\n".join([seg["text"] for seg in segments])

                # Fetch video title
                video_title = f"YouTube Video {video_id}"
                try:
                    import requests
                    title_proxy_url = self.get_random_proxy()
                    response = requests.get(
                        f'https://www.youtube.com/watch?v={video_id}',
                        headers={
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8'
                        },
                        proxies={'http': title_proxy_url, 'https': title_proxy_url},
                        timeout=10
                    )
                    if response.status_code == 200:
                        m = re.search(r'<title>(.+?)</title>', response.text)
                        if m:
                            video_title = m.group(1).replace(' - YouTube', '').strip()
                            print(f"📺 Video title: {video_title}")
                except Exception as e:
                    print(f"⚠️ Could not fetch video title: {str(e)[:100]}")

                return {
                    "text": full_text,
                    "segments": segments,
                    "title": video_title,
                    "language": transcript.language,
                    "is_generated": transcript.is_generated,
                    "video_id": video_id,
                    "method": "youtube_transcript_api"
                }

            except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as e:
                print(f"ℹ️ No subtitles available: {str(e)[:100]}")
                return None  # No point retrying — video has no captions
            except Exception as e:
                print(f"⚠️ Attempt {attempt + 1} failed: {str(e)[:150]}")
                if attempt < 2:
                    continue

        print("⚠️ All 3 proxy attempts failed")
        return None

    async def get_youtube_transcript_ytdlp(self, youtube_url: str) -> Optional[Dict[str, Any]]:
        """Fetch subtitles via yt-dlp as fallback when youtube-transcript-api is blocked."""
        video_id = self.extract_video_id(youtube_url)
        if not video_id:
            return None

        temp_dir = tempfile.mkdtemp()
        try:
            proxy_url = self.get_random_proxy()
            print(f"📥 yt-dlp subtitle fallback — proxy: {proxy_url.split('@')[1]}")

            cmd = [
                'yt-dlp',
                '--write-auto-subs', '--sub-langs', 'en.*,fr.*',
                '--convert-subs', 'srt',
                '--skip-download',
                '--proxy', proxy_url,
                '--no-warnings',
                '-o', os.path.join(temp_dir, video_id),
                youtube_url
            ]
            subprocess.run(cmd, capture_output=True, text=True, timeout=60)

            srt_files = glob.glob(os.path.join(temp_dir, '*.srt'))
            if not srt_files:
                print("⚠️ yt-dlp found no subtitle files")
                return None

            with open(srt_files[0], 'r', encoding='utf-8') as f:
                content = f.read()

            # Parse SRT: strip index/timestamps, keep text
            text_blocks = []
            for line in content.strip().split('\n'):
                line = line.strip()
                if not line or line.isdigit() or '-->' in line:
                    continue
                clean = re.sub(r'<[^>]+>', '', line)
                if clean:
                    text_blocks.append(clean)

            full_text = '\n'.join(text_blocks)
            if not full_text.strip():
                return None

            # Get video title via yt-dlp
            title = f"YouTube Video {video_id}"
            try:
                info_cmd = [
                    'yt-dlp', '--dump-json', '--skip-download',
                    '--proxy', proxy_url, '--no-warnings', youtube_url
                ]
                info = subprocess.run(info_cmd, capture_output=True, text=True, timeout=30)
                if info.returncode == 0:
                    title = json.loads(info.stdout).get('title', title)
            except Exception:
                pass

            print(f"✅ yt-dlp subtitles: {len(full_text)} chars — title: {title[:60]}")
            return {
                "text": full_text,
                "title": title,
                "language": "en",
                "video_id": video_id,
                "method": "ytdlp_subs"
            }

        except Exception as e:
            print(f"⚠️ yt-dlp subtitle fallback failed: {str(e)[:200]}")
            return None
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

    async def ingest_video(self, youtube_url: str) -> Dict[str, str]:
        """Download audio from YouTube video."""
        try:
            clean_url = youtube_url.split('?')[0] if '?si=' in youtube_url else youtube_url
            temp_dir = tempfile.mkdtemp()
            output_template = os.path.join(temp_dir, '%(id)s.%(ext)s')

            print(f"🔄 Updating yt-dlp...")
            subprocess.run(['pip', 'install', '--upgrade', 'yt-dlp'], capture_output=True, check=False)

            cookies_path = '/app/youtube_cookies.txt'
            use_cookies = os.path.exists(cookies_path)

            proxy_url = self.get_random_proxy()
            print(f"🌐 Using Webshare proxy for download: {proxy_url.split('@')[1]}")

            common_args = [
                '--no-playlist',
                '--proxy', proxy_url,
                '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                '--referer', 'https://www.youtube.com/',
                '--add-header', 'Accept-Language:en-US,en;q=0.9',
                '--no-check-certificate',
                '--no-warnings',
            ]

            if use_cookies:
                print("🍪 Using YouTube cookies for authentication...")
                common_args.extend(['--cookies', cookies_path])

            strategies = [
                {'name': 'Default', 'args': []},
                {'name': 'Android client', 'args': ['--extractor-args', 'youtube:player_client=android']},
                {'name': 'iOS client', 'args': ['--extractor-args', 'youtube:player_client=ios']},
            ]

            video_info = None
            successful_strategy = None
            last_error = None

            for strategy in strategies:
                print(f"🔍 Strategy: {strategy['name']}...")
                info_cmd = ['yt-dlp', '--dump-json'] + common_args + strategy['args'] + [clean_url]
                info_result = subprocess.run(info_cmd, capture_output=True, text=True, timeout=60)

                if info_result.returncode == 0:
                    try:
                        video_info = json.loads(info_result.stdout)
                        successful_strategy = strategy
                        print(f"✅ Success with {strategy['name']}!")
                        break
                    except Exception as parse_error:
                        print(f"⚠️ Parse error: {str(parse_error)[:100]}")
                        continue
                else:
                    last_error = info_result.stderr[:200] if info_result.stderr else 'Unknown error'
                    print(f"⚠️ Failed: {last_error[:100]}")

            if not video_info:
                raise Exception(f"All strategies failed. Last error: {last_error}" if last_error else "Unable to access video")

            video_id = video_info.get('id', 'video')
            title = video_info.get('title', 'Unknown')
            print(f"📥 Downloading: {title[:60]}...")

            download_cmd = [
                'yt-dlp',
                '-f', 'bestaudio/best',
                '-x', '--audio-format', 'mp3',
                '--audio-quality', '0',
                '-o', output_template,
            ] + common_args + (successful_strategy['args'] if successful_strategy else []) + [clean_url]

            download_result = subprocess.run(download_cmd, capture_output=True, timeout=300)

            if download_result.returncode == 0:
                audio_path = os.path.join(temp_dir, f"{video_id}.mp3")
                if os.path.exists(audio_path):
                    file_size = os.path.getsize(audio_path) / (1024 * 1024)
                    print(f"✅ Downloaded: {file_size:.1f}MB")
                    return {"audio_path": audio_path, "title": title, "video_id": video_id}

            error_msg = download_result.stderr.decode('utf-8', errors='ignore') if download_result.stderr else 'Unknown error'
            raise Exception(f"Download failed: {error_msg[:200]}")

        except subprocess.TimeoutExpired:
            raise Exception("Download timeout - video may be too long or connection is slow")
        except Exception as e:
            print(f"❌ Failed: {e}")
            raise

    async def transcribe_audio(self, audio_data: Dict[str, str], job_id: str) -> Dict[str, Any]:
        """Transcribe audio using AssemblyAI."""
        try:
            audio_path = audio_data["audio_path"]

            config = aai.TranscriptionConfig(
                summarization=True,
                summary_model=aai.SummarizationModel.informative,
                summary_type=aai.SummarizationType.bullets
            )

            transcriber = aai.Transcriber(config=config)
            transcript = transcriber.transcribe(audio_path)

            while transcript.status not in [aai.TranscriptStatus.completed, aai.TranscriptStatus.error]:
                await asyncio.sleep(5)

            if transcript.status == aai.TranscriptStatus.error:
                raise Exception(f"Transcription failed: {transcript.error}")

            transcript_data = {
                "text": transcript.text,
                "summary": transcript.summary,
                "chapters": [
                    {"headline": ch.headline, "start": ch.start, "end": ch.end}
                    for ch in (transcript.chapters or [])
                ]
            }

            prisma = Prisma()
            await prisma.connect()
            try:
                await prisma.transcript.create(
                    data={
                        "jobId": job_id,
                        "fullTranscript": json.dumps(transcript_data)
                    }
                )
            finally:
                await prisma.disconnect()

            if os.path.exists(audio_path):
                os.remove(audio_path)

            return transcript_data

        except Exception as e:
            print(f"❌ Failed to transcribe audio: {e}")
            raise

    async def generate_content_assets(self, transcript_text: str, video_title: str, job_id: str) -> bool:
        """Generate all content assets using Gemini."""
        try:
            prisma = Prisma()
            await prisma.connect()

            for method_name, asset_type in [
                ('generate_blog_post', 'BLOG_POST'),
                ('generate_twitter_thread', 'TWITTER_THREAD'),
                ('generate_linkedin_post', 'LINKEDIN_POST'),
                ('generate_tiktok', 'TIKTOK'),
            ]:
                print(f"📝 Generating {asset_type}...")
                result = await getattr(self.gemini, method_name)(transcript_text, video_title)
                await prisma.contentasset.create(
                    data={
                        "jobId": job_id,
                        "type": asset_type,
                        "content": result["content"],
                        "status": "GENERATED"
                    }
                )
                print(f"✅ {asset_type} generated")

            await prisma.disconnect()
            return True

        except Exception as e:
            print(f"❌ Failed to generate content assets: {e}")
            return False
