import asyncio
from datetime import timedelta
from typing import Dict, Any
from temporalio import workflow
from temporalio.common import RetryPolicy

from .activities import (
    update_video_status,
    ingest_video,
    transcribe_audio,
    analyze_transcript,
    generate_content_assets
)

@workflow.defn
class ProcessVideoWorkflow:
    """Main workflow for processing video content and generating assets."""
    
    @workflow.run
    async def run(self, video_source_id: str, youtube_url: str, job_id: str) -> Dict[str, Any]:
        """
        Main workflow execution method.
        
        Args:
            video_source_id: ID of the VideoSource record
            youtube_url: YouTube URL to process
            job_id: ProcessingJob ID for tracking
        """
        
        # Define retry policy for external API calls
        api_retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=1),
            backoff_coefficient=2.0,
            maximum_interval=timedelta(minutes=5),
            maximum_attempts=5,
            non_retryable_error_types=["ValueError", "TypeError"]
        )
        
        # Define retry policy for database operations
        db_retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=1),
            backoff_coefficient=2.0,
            maximum_interval=timedelta(seconds=30),
            maximum_attempts=3
        )
        
        try:
            # Step 1: Update video status to PROCESSING
            await workflow.execute_activity(
                update_video_status,
                args=[video_source_id, "PROCESSING"],
                start_to_close_timeout=timedelta(minutes=1),
                retry_policy=db_retry_policy
            )
            
            # Step 2: Ingest video (download audio)
            workflow.logger.info(f"Starting video ingestion for {youtube_url}")
            ingest_result = await workflow.execute_activity(
                ingest_video,
                args=[youtube_url],
                start_to_close_timeout=timedelta(minutes=10),
                retry_policy=api_retry_policy
            )
            
            # Step 3: Transcribe audio with AI features
            workflow.logger.info("Starting audio transcription")
            transcript_result = await workflow.execute_activity(
                transcribe_audio,
                args=[ingest_result, job_id],
                start_to_close_timeout=timedelta(minutes=30),
                retry_policy=api_retry_policy
            )
            
            # Step 4: Analyze transcript for strategic insights
            workflow.logger.info("Analyzing transcript for content strategy")
            analysis_result = await workflow.execute_activity(
                analyze_transcript,
                args=[transcript_result],
                start_to_close_timeout=timedelta(minutes=5),
                retry_policy=api_retry_policy
            )
            
            # Step 5: Generate content assets in parallel
            workflow.logger.info("Generating content assets in parallel")
            asset_types = ["BLOG_POST", "TWITTER_THREAD", "LINKEDIN_POST", "NEWSLETTER", "VIDEO_HIGHLIGHTS"]
            
            # Create parallel tasks for content generation
            content_tasks = []
            for asset_type in asset_types:
                task = workflow.execute_activity(
                    generate_content_assets,
                    args=[
                        asset_type,
                        transcript_result["text"],
                        transcript_result.get("summary", {}),
                        transcript_result.get("chapters", []),
                        analysis_result,
                        job_id
                    ],
                    start_to_close_timeout=timedelta(minutes=10),
                    retry_policy=api_retry_policy
                )
                content_tasks.append(task)
            
            # Wait for all content generation tasks to complete
            content_results = await asyncio.gather(*content_tasks, return_exceptions=True)
            
            # Check for any failures in content generation
            failed_assets = []
            for i, result in enumerate(content_results):
                if isinstance(result, Exception):
                    failed_assets.append(asset_types[i])
                    workflow.logger.error(f"Failed to generate {asset_types[i]}: {result}")
            
            # Step 6: Update video status to COMPLETED
            await workflow.execute_activity(
                update_video_status,
                args=[video_source_id, "COMPLETED"],
                start_to_close_timeout=timedelta(minutes=1),
                retry_policy=db_retry_policy
            )
            
            # Update job status to COMPLETED
            from prisma import Prisma
            prisma = Prisma()
            await prisma.connect()
            await prisma.processingjob.update(
                where={"id": job_id},
                data={"status": "COMPLETED"}
            )
            await prisma.disconnect()
            
            workflow.logger.info(f"Workflow completed successfully for video {video_source_id}")
            
            return {
                "status": "completed",
                "video_source_id": video_source_id,
                "job_id": job_id,
                "generated_assets": len([r for r in content_results if not isinstance(r, Exception)]),
                "failed_assets": failed_assets,
                "title": ingest_result.get("title", "Unknown")
            }
            
        except Exception as e:
            workflow.logger.error(f"Workflow failed for video {video_source_id}: {e}")
            
            # Update video status to FAILED
            try:
                await workflow.execute_activity(
                    update_video_status,
                    args=[video_source_id, "FAILED"],
                    start_to_close_timeout=timedelta(minutes=1),
                    retry_policy=db_retry_policy
                )
                
                # Update job status to FAILED
                from prisma import Prisma
                prisma = Prisma()
                await prisma.connect()
                await prisma.processingjob.update(
                    where={"id": job_id},
                    data={"status": "FAILED"}
                )
                await prisma.disconnect()
                
            except Exception as update_error:
                workflow.logger.error(f"Failed to update status after workflow failure: {update_error}")
            
            return {
                "status": "failed",
                "video_source_id": video_source_id,
                "job_id": job_id,
                "error": str(e)
            }

@workflow.defn
class HealthCheckWorkflow:
    """Simple workflow for health checks and system monitoring."""
    
    @workflow.run
    async def run(self) -> Dict[str, str]:
        """Simple health check workflow."""
        return {
            "status": "healthy",
            "timestamp": workflow.now().isoformat()
        }
