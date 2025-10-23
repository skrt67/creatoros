#!/usr/bin/env python3
"""
Test script for real YouTube transcription
"""
import asyncio
import sys
import os

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.youtube_service import YouTubeService
from app.services.transcription_service import TranscriptionService

async def test_transcription():
    """Test the real transcription pipeline."""
    
    # Test with a short YouTube video
    youtube_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    print(f"🎬 Testing transcription for: {youtube_url}")
    
    try:
        # Step 1: Test YouTube service
        print("\n📥 Step 1: Extracting video info...")
        youtube_service = YouTubeService()
        video_info = youtube_service.extract_video_info(youtube_url)
        print(f"✅ Video Title: {video_info['title']}")
        print(f"✅ Duration: {video_info['duration']} seconds")
        print(f"✅ Uploader: {video_info['uploader']}")
        
        # Step 2: Test audio download
        print("\n🎵 Step 2: Downloading audio...")
        audio_path = youtube_service.download_audio(youtube_url)
        print(f"✅ Audio downloaded to: {audio_path}")
        print(f"✅ File size: {os.path.getsize(audio_path)} bytes")
        
        # Step 3: Test transcription
        print("\n🗣️ Step 3: Transcribing audio...")
        transcription_service = TranscriptionService()
        
        if transcription_service.assemblyai_key:
            print("✅ Using AssemblyAI for transcription")
            result = await transcription_service.transcribe_audio(audio_path)
            print(f"✅ Transcription service: {result.get('service', 'unknown')}")
            print(f"✅ Language: {result.get('language', 'unknown')}")
            print(f"✅ Confidence: {result.get('confidence', 0)}")
            print(f"✅ Text length: {len(result.get('full_text', ''))}")
            print(f"✅ Number of segments: {len(result.get('segments', []))}")
            print(f"\n📝 First 200 characters of transcript:")
            print(result.get('full_text', '')[:200] + "...")
        else:
            print("❌ No AssemblyAI key found")
        
        # Step 4: Cleanup
        print(f"\n🧹 Step 4: Cleaning up...")
        youtube_service.cleanup_file(audio_path)
        print("✅ Cleanup completed")
        
        print("\n🎉 All tests passed! Real transcription is working!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_transcription())
