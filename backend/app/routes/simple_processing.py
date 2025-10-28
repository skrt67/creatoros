"""Simple video processing without Temporal."""

import asyncio
from fastapi import APIRouter, BackgroundTasks
from prisma import Prisma
from ..models import APIResponse
from ..services.video_processor import VideoProcessor

router = APIRouter(tags=["processing"])

async def process_video_complete(video_source_id: str, youtube_url: str, job_id: str):
    """Process video with full pipeline."""
    prisma = Prisma()
    processor = VideoProcessor()
    
    await prisma.connect()
    
    try:
        await prisma.videosource.update(
            where={"id": video_source_id},
            data={"status": "PROCESSING"}
        )
        
        print(f"🎬 Starting video processing: {youtube_url}")
        
        # Step 1: Try to get YouTube transcript first (fast, no download, no blocks)
        transcript_result = await processor.get_youtube_transcript(youtube_url)
        
        video_title = "Unknown Video"
        
        if transcript_result:
            # Success! Use YouTube subtitles
            print(f"✅ YouTube transcript fetched ({transcript_result['method']})")
            
            # Use the actual video title from YouTube
            video_title = transcript_result.get('title', f"YouTube Video {transcript_result['video_id']}")
            
            # Update video title
            await prisma.videosource.update(
                where={"id": video_source_id},
                data={"title": video_title}
            )
            
            # Store transcript in database with full text and segments
            transcript_data = {
                "text": transcript_result['text'],
                "segments": transcript_result.get('segments', []),
                "summary": None,
                "chapters": []
            }
            
            import json
            await prisma.transcript.create(
                data={
                    "jobId": job_id,
                    "fullTranscript": json.dumps(transcript_data)
                }
            )
            
            print(f"✅ Transcription complete: {len(transcript_data['text'])} characters (from YouTube subtitles)")
            
        else:
            # Fallback: Download audio and use AssemblyAI
            print("ℹ️ No YouTube subtitles available, using audio download + AssemblyAI...")
            
            print("📥 Downloading audio...")
            audio_data = await processor.ingest_video(youtube_url)
            print(f"✅ Audio downloaded: {audio_data['title']}")
            
            video_title = audio_data['title']
            
            # Update video title
            await prisma.videosource.update(
                where={"id": video_source_id},
                data={"title": video_title}
            )
            
            # Step 2: Transcribe audio
            print("🎙️ Transcribing audio with AssemblyAI...")
            transcript_data = await processor.transcribe_audio(audio_data, job_id)
            print(f"✅ Transcription complete: {len(transcript_data['text'])} characters (from AssemblyAI)")
        
        # Step 3: Generate content assets
        print("📝 Generating content assets with Gemini AI...")
        await processor.generate_content_assets(
            transcript_data['text'],
            video_title,
            job_id
        )
        
        # Mark as completed
        await prisma.videosource.update(
            where={"id": video_source_id},
            data={"status": "COMPLETED"}
        )
        
        await prisma.processingjob.update(
            where={"id": job_id},
            data={"status": "COMPLETED"}
        )
        
        print(f"✅ Video {video_source_id} processed successfully!")
        print(f"✨ Generated transcript + blog + Twitter + LinkedIn content")
        
    except Exception as e:
        print(f"❌ Error processing video: {e}")
        
        try:
            await prisma.videosource.update(
                where={"id": video_source_id},
                data={"status": "FAILED"}
            )
            
            await prisma.processingjob.update(
                where={"id": job_id},
                data={"status": "FAILED"}
            )
        except:
            pass
        
    finally:
        await prisma.disconnect()

@router.post("/process-pending-videos", response_model=APIResponse)
async def process_pending_videos(background_tasks: BackgroundTasks):
    """Process all pending videos with full AI pipeline."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        pending_videos = await prisma.videosource.find_many(
            where={"status": "PENDING"},
            include={"processingJob": True}
        )
        
        processed_count = 0
        for video in pending_videos:
            if video.processingJob:
                background_tasks.add_task(
                    process_video_complete,
                    video.id,
                    video.youtubeUrl,
                    video.processingJob.id
                )
                processed_count += 1
        
        return APIResponse(
            success=True,
            message=f"{processed_count} videos queued for AI processing (transcription + content generation)",
            data={"count": processed_count}
        )
        
    finally:
        await prisma.disconnect()
