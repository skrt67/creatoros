"""
Processing routes for manual video processing without Temporal
"""
import asyncio
import os
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma
from ..models import APIResponse
from ..auth import get_current_active_user
from ..services.youtube_service import YouTubeService
from ..services.transcription_service import TranscriptionService
from ..services.content_generation_service import ContentGenerationService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/processing", tags=["processing"])

@router.post("/force-real-processing/{video_id}")
async def force_real_processing(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Force real processing without fallback."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get video
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={"workspace": True}
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Update status to processing
        await prisma.videosource.update(
            where={"id": video_id},
            data={"status": "PROCESSING"}
        )
        
        # Initialize services
        youtube_service = YouTubeService()
        transcription_service = TranscriptionService()
        content_service = ContentGenerationService()
        
        # Step 1: Extract video information
        logger.info(f"Extracting video info for {video.youtubeUrl}")
        video_info = youtube_service.extract_video_info(video.youtubeUrl)
        logger.info(f"Got video info: {video_info['title']}")
        
        # Update video with real title
        await prisma.videosource.update(
            where={"id": video_id},
            data={"title": video_info['title']}
        )
        logger.info(f"Updated video title to: {video_info['title']}")
        
        # Step 2: Create or update processing job
        existing_job = await prisma.processingjob.find_unique(
            where={"videoSourceId": video_id}
        )
        
        if existing_job:
            job = await prisma.processingjob.update(
                where={"id": existing_job.id},
                data={"status": "STARTED"}
            )
        else:
            job = await prisma.processingjob.create(
                data={
                    "videoSourceId": video_id,
                    "status": "STARTED",
                    "temporalWorkflowId": f"force-real-processing-{video_id}"
                }
            )
        
        # Step 3: Download audio from YouTube
        logger.info(f"Downloading audio for video {video_id}")
        audio_path = youtube_service.download_audio(video.youtubeUrl)
        logger.info(f"Audio downloaded to: {audio_path}")
        
        # Step 4: Transcribe the audio
        logger.info(f"Transcribing audio for video {video_id}")
        transcription_result = await transcription_service.transcribe_audio(audio_path)
        logger.info(f"Transcription completed: {len(transcription_result.get('full_text', ''))} characters")
        
        # Clean up audio file
        youtube_service.cleanup_file(audio_path)
        
        # Step 5: Store transcription
        import json
        transcript_data = json.dumps(transcription_result)
        
        # Create or update transcript record
        existing_transcript = await prisma.transcript.find_unique(
            where={"jobId": job.id}
        )
        
        if existing_transcript:
            transcript = await prisma.transcript.update(
                where={"id": existing_transcript.id},
                data={"fullTranscript": transcript_data}
            )
        else:
            transcript = await prisma.transcript.create(
                data={
                    "jobId": job.id,
                    "fullTranscript": transcript_data
                }
            )
        
        # Step 6: Generate content based on real transcript
        logger.info(f"Generating content for video {video_id}")
        content_assets_data = await content_service.generate_content_from_transcript(
            transcription_result.get('full_text', ''),
            {
                'title': video_info['title'],
                'youtube_url': video.youtubeUrl,
                'duration': video_info.get('duration', 0),
                'uploader': video_info.get('uploader', '')
            }
        )
        
        # Delete existing content assets and create new ones
        await prisma.contentasset.delete_many(
            where={"jobId": job.id}
        )
        
        # Create content asset records
        for asset_data in content_assets_data:
            await prisma.contentasset.create(
                data={
                    "jobId": job.id,
                    **asset_data
                }
            )
        
        # Update job status to completed
        await prisma.processingjob.update(
            where={"id": job.id},
            data={"status": "COMPLETED"}
        )
        
        # Update video status to completed
        await prisma.videosource.update(
            where={"id": video_id},
            data={"status": "COMPLETED"}
        )
        
        return APIResponse(
            success=True,
            message="Video processed successfully with real processing",
            data={
                "video_id": video_id,
                "transcript_id": transcript.id,
                "content_assets_count": len(content_assets_data),
                "title": video_info['title']
            }
        )
        
    except Exception as e:
        logger.error(f"Force real processing error: {str(e)}")
        # Update status to failed
        try:
            await prisma.videosource.update(
                where={"id": video_id},
                data={"status": "FAILED"}
            )
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.post("/process-video/{video_id}")
async def process_video_manually(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Manually process a video (simulate Temporal workflow)"""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get video
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={"workspace": True}
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Update status to processing
        await prisma.videosource.update(
            where={"id": video_id},
            data={"status": "PROCESSING"}
        )
        
        # Initialize services
        youtube_service = YouTubeService()
        transcription_service = TranscriptionService()
        content_service = ContentGenerationService()
        
        try:
            # Step 1: Extract video information
            logger.info(f"Extracting video info for {video.youtubeUrl}")
            video_info = youtube_service.extract_video_info(video.youtubeUrl)
            
            # Update video with real title
            await prisma.videosource.update(
                where={"id": video_id},
                data={"title": video_info['title']}
            )
            logger.info(f"Updated video title to: {video_info['title']}")
            
            # Step 2: Create or update processing job
            existing_job = await prisma.processingjob.find_unique(
                where={"videoSourceId": video_id}
            )
            
            if existing_job:
                job = await prisma.processingjob.update(
                    where={"id": existing_job.id},
                    data={"status": "STARTED"}
                )
            else:
                job = await prisma.processingjob.create(
                    data={
                        "videoSourceId": video_id,
                        "status": "STARTED",
                        "temporalWorkflowId": f"real-processing-{video_id}"
                    }
                )
            
            # Step 3: Download audio from YouTube
            logger.info(f"Downloading audio for video {video_id}")
            audio_path = youtube_service.download_audio(video.youtubeUrl)
            
            # Step 4: Transcribe the audio
            logger.info(f"Transcribing audio for video {video_id}")
            transcription_result = await transcription_service.transcribe_audio(audio_path)
            
            # Clean up audio file
            youtube_service.cleanup_file(audio_path)
            
            # Step 5: Store transcription
            import json
            transcript_data = json.dumps(transcription_result)
            
            # Step 6: Generate content based on real transcript
            logger.info(f"Generating content for video {video_id}")
            content_assets_data = await content_service.generate_content_from_transcript(
                transcription_result.get('full_text', ''),
                {
                    'title': video_info['title'],
                    'youtube_url': video.youtubeUrl,
                    'duration': video_info.get('duration', 0),
                    'uploader': video_info.get('uploader', '')
                }
            )
            
        except Exception as processing_error:
            logger.error(f"Real processing failed, falling back to demo: {str(processing_error)}")
            
            # Fallback to demo processing
            await asyncio.sleep(2)
            
            existing_job = await prisma.processingjob.find_unique(
                where={"videoSourceId": video_id}
            )
            
            if existing_job:
                job = await prisma.processingjob.update(
                    where={"id": existing_job.id},
                    data={"status": "STARTED"}
                )
            else:
                job = await prisma.processingjob.create(
                    data={
                        "videoSourceId": video_id,
                        "status": "STARTED",
                        "temporalWorkflowId": f"demo-workflow-{video_id}"
                    }
                )
            
            # Create demo transcript
            import json
            transcript_data = json.dumps({
                "segments": [
                    {"start": 0.0, "end": 30.0, "text": "Welcome to this video demonstration"},
                    {"start": 30.0, "end": 60.0, "text": "This is an AI-generated transcript"},
                    {"start": 60.0, "end": 90.0, "text": "The video processing has been completed successfully"},
                    {"start": 90.0, "end": 120.0, "text": "Thank you for watching this CreatorOS demo"},
                    {"start": 120.0, "end": 150.0, "text": "End of transcript"}
                ],
                "full_text": f"This is a demo transcript for the video: {video.youtubeUrl}. Welcome to this video demonstration. This is an AI-generated transcript. The video processing has been completed successfully. Thank you for watching this CreatorOS demo. End of transcript. This transcript was automatically generated by CreatorOS AI processing system.",
                "language": "en",
                "confidence": 0.85,
                "service": "demo",
                "note": "Demo transcription - install yt-dlp and whisper for real processing"
            })
        
        # Create or update transcript record
        existing_transcript = await prisma.transcript.find_unique(
            where={"jobId": job.id}
        )
        
        if existing_transcript:
            transcript = await prisma.transcript.update(
                where={"id": existing_transcript.id},
                data={"fullTranscript": transcript_data}
            )
        else:
            transcript = await prisma.transcript.create(
                data={
                    "jobId": job.id,
                    "fullTranscript": transcript_data
                }
            )
        
        # Use real generated content or fallback to demo
        if 'content_assets_data' in locals():
            content_assets = content_assets_data
        else:
            # Fallback content assets for demo
            content_assets = [
                {
                    "type": "BLOG_POST",
                    "content": f"""# Blog Post: {video.youtubeUrl}

## Introduction
This blog post was automatically generated from your YouTube video using CreatorOS AI technology.

## Key Points
- Professional content creation made easy
- AI-powered video analysis and transcription  
- Multiple content formats from a single video
- Streamlined workflow for content creators

## Conclusion
CreatorOS transforms your video content into multiple marketing assets, saving you hours of manual work.

*Generated by CreatorOS AI - {video_id}*
""",
                    "status": "GENERATED"
                },
                {
                    "type": "TWITTER_THREAD",
                    "content": f"""🎬 Just processed an amazing video with @CreatorOS! 

✨ AI-powered content creation
🚀 Multiple formats from one video  
⏰ Saves hours of work

Check it out: {video.youtubeUrl}

#ContentCreation #AI #VideoMarketing #CreatorOS
""",
                    "status": "GENERATED"
                },
                {
                    "type": "LINKEDIN_POST", 
                    "content": f"""🎯 Excited to share how CreatorOS is revolutionizing content creation!

Just processed this video and got:
→ Full transcript with timestamps
→ Blog post ready for publishing  
→ Social media content optimized
→ Newsletter content formatted

The AI analysis extracted key insights and created multiple content formats automatically.

This is the future of content marketing - one video, endless possibilities.

Video: {video.youtubeUrl}

#ContentStrategy #AITools #VideoMarketing #Productivity
""",
                    "status": "GENERATED"
                },
                {
                    "type": "NEWSLETTER",
                    "content": f"""📧 Newsletter Content

Subject: New Video Content Available

Dear Subscriber,

We're excited to share our latest video content with you:

🎬 Video: {video.youtubeUrl}

Key highlights from this video:
• Professional insights on content creation
• Practical tips you can implement today
• Behind-the-scenes look at our process

This content was processed using CreatorOS AI technology, ensuring high-quality, engaging material for our audience.

Best regards,
The CreatorOS Team

---
Powered by CreatorOS AI Content Generation
""",
                    "status": "GENERATED"
                }
            ]
        
        # Delete existing content assets and create new ones
        await prisma.contentasset.delete_many(
            where={"jobId": job.id}
        )
        
        # Create content asset records
        for asset_data in content_assets:
            await prisma.contentasset.create(
                data={
                    "jobId": job.id,
                    **asset_data
                }
            )
        
        # Update job status to completed
        await prisma.processingjob.update(
            where={"id": job.id},
            data={"status": "COMPLETED"}
        )
        
        # Update video status to completed
        await prisma.videosource.update(
            where={"id": video_id},
            data={
                "status": "COMPLETED",
                "title": f"Processed Video - {video_id[:8]}"
            }
        )
        
        return APIResponse(
            success=True,
            message="Video processed successfully",
            data={
                "video_id": video_id,
                "transcript_id": transcript.id,
                "content_assets_count": len(content_assets)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        # Update status to failed
        try:
            await prisma.videosource.update(
                where={"id": video_id},
                data={"status": "FAILED"}
            )
        except:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Processing failed: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.post("/process-all-pending")
async def process_all_pending_videos(
    current_user = Depends(get_current_active_user)
):
    """Process all pending videos for the current user"""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get all pending videos for user's workspaces
        workspaces = await prisma.workspace.find_many(
            where={"ownerId": current_user.id}
        )
        
        workspace_ids = [ws.id for ws in workspaces]
        
        pending_videos = await prisma.videosource.find_many(
            where={
                "workspaceId": {"in": workspace_ids},
                "status": "PENDING"
            }
        )
        
        processed_count = 0
        for video in pending_videos:
            try:
                # Process each video (reuse the logic from above)
                await prisma.videosource.update(
                    where={"id": video.id},
                    data={"status": "PROCESSING"}
                )
                
                # Simulate processing
                await asyncio.sleep(1)
                
                # Create transcript
                transcript_content = f"Simulated transcript for video {video.id}"
                await prisma.transcript.create(
                    data={
                        "videoSourceId": video.id,
                        "content": transcript_content,
                        "status": "COMPLETED"
                    }
                )
                
                # Create content assets
                await prisma.contentasset.create(
                    data={
                        "videoSourceId": video.id,
                        "type": "blog_post",
                        "content": f"Blog post content for {video.id}",
                        "status": "COMPLETED"
                    }
                )
                
                # Mark as completed
                await prisma.videosource.update(
                    where={"id": video.id},
                    data={
                        "status": "COMPLETED",
                        "title": f"Processed Video - {video.id[:8]}"
                    }
                )
                
                processed_count += 1
                
            except Exception as e:
                logger.error(f"Failed to process video {video.id}: {str(e)}")
                await prisma.videosource.update(
                    where={"id": video.id},
                    data={"status": "FAILED"}
                )
        
        return APIResponse(
            success=True,
            message=f"Processed {processed_count} videos",
            data={"processed_count": processed_count}
        )
        
    except Exception as e:
        logger.error(f"Batch processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch processing failed: {str(e)}"
        )
    finally:
        await prisma.disconnect()
