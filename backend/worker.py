"""Temporal worker for processing video workflows."""

import asyncio
import os
from temporalio.client import Client
from temporalio.worker import Worker

from temporal_workflows.workflows import ProcessVideoWorkflow, HealthCheckWorkflow
from temporal_workflows.activities import (
    update_video_status,
    ingest_video,
    transcribe_audio,
    analyze_transcript,
    generate_content_assets
)

async def main():
    """Main worker function."""
    # Connect to Temporal server
    temporal_server_url = os.getenv("TEMPORAL_SERVER_URL", "localhost:7233")
    client = await Client.connect(temporal_server_url)
    
    print(f"🔗 Connected to Temporal server at {temporal_server_url}")
    
    # Create worker
    worker = Worker(
        client,
        task_queue="video-processing",
        workflows=[ProcessVideoWorkflow, HealthCheckWorkflow],
        activities=[
            update_video_status,
            ingest_video,
            transcribe_audio,
            analyze_transcript,
            generate_content_assets
        ],
    )
    
    print("🚀 Starting Vidova Temporal Worker...")
    print("📋 Registered workflows:")
    print("   - ProcessVideoWorkflow")
    print("   - HealthCheckWorkflow")
    print("🎯 Registered activities:")
    print("   - update_video_status")
    print("   - ingest_video")
    print("   - transcribe_audio")
    print("   - analyze_transcript")
    print("   - generate_content_assets")
    print("⏳ Worker is running and waiting for tasks...")
    
    # Run worker
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
