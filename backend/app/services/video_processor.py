"""Service de traitement vidéo complet."""

import asyncio
import os
import tempfile
import subprocess
import json
import re
import random
from typing import Dict, Any, Optional
import assemblyai as aai
from prisma import Prisma
from .gemini_service import GeminiService
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from youtube_transcript_api.proxies import GenericProxyConfig

# Initialize AssemblyAI
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

# Webshare RESIDENTIAL proxy list (rotating IPs)
WEBSHARE_RESIDENTIAL_PROXIES = [
    {"username": "gopomuli-1", "password": "pa41o6pb250v"},
    {"username": "gopomuli-2", "password": "pa41o6pb250v"},
    {"username": "gopomuli-3", "password": "pa41o6pb250v"},
    {"username": "gopomuli-4", "password": "pa41o6pb250v"},
    {"username": "gopomuli-5", "password": "pa41o6pb250v"},
    {"username": "gopomuli-6", "password": "pa41o6pb250v"},
    {"username": "gopomuli-7", "password": "pa41o6pb250v"},
    {"username": "gopomuli-8", "password": "pa41o6pb250v"},
    {"username": "gopomuli-9", "password": "pa41o6pb250v"},
    {"username": "gopomuli-10", "password": "pa41o6pb250v"},
]
WEBSHARE_ENDPOINT = "p.webshare.io"
WEBSHARE_PORT = "80"

class VideoProcessor:
    def __init__(self):
        self.gemini = GeminiService()
    
    def get_random_proxy(self) -> str:
        """Get a random Webshare residential proxy URL."""
        proxy = random.choice(WEBSHARE_RESIDENTIAL_PROXIES)
        return f"http://{proxy['username']}:{proxy['password']}@{WEBSHARE_ENDPOINT}:{WEBSHARE_PORT}"
    
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
    
    async def get_youtube_transcript(self, youtube_url: str) -> Optional[Dict[str, Any]]:
        """Try to fetch transcript directly from YouTube (no download needed)."""
        try:
            video_id = self.extract_video_id(youtube_url)
            if not video_id:
                print("⚠️ Could not extract video ID")
                return None
            
            print(f"📝 Attempting to fetch YouTube subtitles for video {video_id}...")
            
            # Get random proxy
            proxy_url = self.get_random_proxy()
            print(f"🌐 Using Webshare proxy: {proxy_url.split('@')[1]}")
            
            # Configure proxy for youtube-transcript-api
            proxy_config = GenericProxyConfig(
                http_url=proxy_url,
                https_url=proxy_url
            )
            
            # Try to get transcript in preferred languages with proxy
            ytt_api = YouTubeTranscriptApi(proxy_config=proxy_config)
            transcript_list = ytt_api.list(video_id)
            
            # Try to find manual transcript first (better quality)
            try:
                transcript = transcript_list.find_manually_created_transcript(['fr', 'en'])
                print(f"✅ Found manual transcript in {transcript.language}")
            except:
                # Fall back to auto-generated
                transcript = transcript_list.find_generated_transcript(['fr', 'en'])
                print(f"✅ Found auto-generated transcript in {transcript.language}")
            
            # Fetch the transcript
            fetched = transcript.fetch()
            
            # Convert to text with better formatting
            # Group snippets into paragraphs (every ~30 seconds for readability)
            segments = []
            current_paragraph = []
            paragraph_start_time = 0
            
            for i, snippet in enumerate(fetched.snippets):
                current_paragraph.append(snippet.text)
                
                # Create a new paragraph every 30 seconds or every 5 snippets
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
            
            # Full text with paragraph breaks
            full_text = "\n\n".join([seg["text"] for seg in segments])
            
            # Get video title using YouTube Data API v3 (reliable, not blocked)
            video_title = f"YouTube Video {video_id}"  # Fallback
            try:
                import requests
                api_key = os.getenv('YOUTUBE_API_KEY')
                if api_key:
                    response = requests.get(
                        f'https://www.googleapis.com/youtube/v3/videos',
                        params={
                            'part': 'snippet',
                            'id': video_id,
                            'key': api_key
                        },
                        timeout=5
                    )
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('items'):
                            video_title = data['items'][0]['snippet']['title']
                            print(f"📺 Video title: {video_title}")
                    else:
                        print(f"⚠️ YouTube API error: {response.status_code}")
                else:
                    print("⚠️ No YouTube API key configured, using fallback title")
            except Exception as e:
                print(f"⚠️ Could not fetch video title: {str(e)[:50]}")
            
            return {
                "text": full_text,
                "segments": segments,
                "title": video_title,
                "language": transcript.language,
                "is_generated": transcript.is_generated,
                "video_id": video_id,
                "method": "youtube_transcript_api"
            }
            
        except (TranscriptsDisabled, NoTranscriptFound) as e:
            print(f"ℹ️ No subtitles available: {str(e)[:100]}")
            return None
        except Exception as e:
            print(f"⚠️ YouTube transcript fetch failed: {str(e)[:200]}")
            return None
    
    async def ingest_video(self, youtube_url: str) -> Dict[str, str]:
        """Download audio from YouTube video with OAuth2 authentication support."""
        try:
            clean_url = youtube_url.split('?')[0] if '?si=' in youtube_url else youtube_url
            temp_dir = tempfile.mkdtemp()
            output_template = os.path.join(temp_dir, '%(id)s.%(ext)s')
            
            print(f"🔄 Updating yt-dlp...")
            subprocess.run(['pip', 'install', '--upgrade', 'yt-dlp'], capture_output=True, check=False)
            
            # Check if cookies file exists
            cookies_path = '/app/youtube_cookies.txt'
            use_cookies = os.path.exists(cookies_path)
            
            # Base common args with Webshare proxy
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
            
            # Add cookies if available
            if use_cookies:
                print("🍪 Using YouTube cookies for authentication...")
                common_args.extend(['--cookies', cookies_path])
            
            # Multiple strategies - try default first (works better with cookies)
            strategies = [
                {'name': 'Default (cookies)', 'args': []},
                {'name': 'Android client', 'args': ['--extractor-args', 'youtube:player_client=android']},
                {'name': 'iOS client', 'args': ['--extractor-args', 'youtube:player_client=ios']},
            ]
            
            # Get video info
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
                error_detail = f"All strategies failed. Last error: {last_error}" if last_error else "Unable to access video"
                raise Exception(error_detail)
            
            video_id = video_info.get('id', 'video')
            title = video_info.get('title', 'Unknown')
            print(f"📥 Downloading: {title[:60]}...")
            
            # Download with successful strategy
            download_cmd = [
                'yt-dlp',
                '-f', 'bestaudio/best',
                '-x', '--audio-format', 'mp3',
                '--audio-quality', '0',
                '-o', output_template,
            ] + common_args + (successful_strategy['args'] if successful_strategy else strategies[0]['args']) + [clean_url]
            
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
            
            prisma = Prisma()
            await prisma.connect()
            
            transcript_data = {
                "text": transcript.text,
                "summary": transcript.summary,
                "chapters": [
                    {"headline": ch.headline, "start": ch.start, "end": ch.end}
                    for ch in (transcript.chapters or [])
                ]
            }
            
            await prisma.transcript.create(
                data={
                    "jobId": job_id,
                    "fullTranscript": transcript_data
                }
            )
            
            await prisma.disconnect()
            
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
            return transcript_data
        except Exception as e:
            print(f"❌ Failed to transcribe audio: {e}")
            raise
    
    async def generate_content_assets(
        self,
        transcript_text: str,
        video_title: str,
        job_id: str
    ) -> bool:
        """Generate all content assets using Gemini."""
        try:
            prisma = Prisma()
            await prisma.connect()
            
            # Generate Blog Post
            print("📝 Generating blog post...")
            blog_result = await self.gemini.generate_blog_post(transcript_text, video_title)
            await prisma.contentasset.create(
                data={
                    "jobId": job_id,
                    "type": "BLOG_POST",
                    "content": blog_result["content"],
                    "status": "GENERATED"
                }
            )
            print("✅ Blog post generated")
            
            # Generate Twitter Thread
            print("📝 Generating Twitter thread...")
            twitter_result = await self.gemini.generate_twitter_thread(transcript_text, video_title)
            await prisma.contentasset.create(
                data={
                    "jobId": job_id,
                    "type": "TWITTER_THREAD",
                    "content": twitter_result["content"],
                    "status": "GENERATED"
                }
            )
            print("✅ Twitter thread generated")
            
            # Generate LinkedIn Post
            print("📝 Generating LinkedIn post...")
            linkedin_result = await self.gemini.generate_linkedin_post(transcript_text, video_title)
            await prisma.contentasset.create(
                data={
                    "jobId": job_id,
                    "type": "LINKEDIN_POST",
                    "content": linkedin_result["content"],
                    "status": "GENERATED"
                }
            )
            print("✅ LinkedIn post generated")
            
            # Generate TikTok Script
            print("📝 Generating TikTok script...")
            tiktok_result = await self.gemini.generate_tiktok(transcript_text, video_title)
            await prisma.contentasset.create(
                data={
                    "jobId": job_id,
                    "type": "TIKTOK",
                    "content": tiktok_result["content"],
                    "status": "GENERATED"
                }
            )
            print("✅ TikTok script generated")
            
            await prisma.disconnect()
            
            return True
        except Exception as e:
            print(f"❌ Failed to generate content assets: {e}")
            return False
