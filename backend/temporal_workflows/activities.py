import asyncio
import json
import os
import tempfile
from typing import Dict, Any
from temporalio import activity
import assemblyai as aai
from pytube import YouTube
from prisma import Prisma
import httpx

# Initialize AssemblyAI
aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

@activity.defn(name="update_video_status")
async def update_video_status(video_source_id: str, status: str) -> bool:
    """Update the status of a VideoSource in the database."""
    try:
        prisma = Prisma()
        await prisma.connect()
        
        await prisma.videosource.update(
            where={"id": video_source_id},
            data={"status": status}
        )
        
        await prisma.disconnect()
        return True
    except Exception as e:
        activity.logger.error(f"Failed to update video status: {e}")
        return False

@activity.defn(name="ingest_video")
async def ingest_video(youtube_url: str) -> Dict[str, str]:
    """Download audio from YouTube video."""
    try:
        # Create YouTube object
        yt = YouTube(youtube_url)
        
        # Get audio stream
        audio_stream = yt.streams.filter(only_audio=True).first()
        
        # Create temporary file
        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, f"{yt.video_id}.mp4")
        
        # Download audio
        audio_stream.download(output_path=temp_dir, filename=f"{yt.video_id}.mp4")
        
        return {
            "audio_path": audio_path,
            "title": yt.title,
            "video_id": yt.video_id
        }
    except Exception as e:
        activity.logger.error(f"Failed to ingest video: {e}")
        raise

@activity.defn(name="transcribe_audio")
async def transcribe_audio(audio_data: Dict[str, str], job_id: str) -> Dict[str, Any]:
    """Transcribe audio using AssemblyAI with Audio Intelligence features."""
    try:
        audio_path = audio_data["audio_path"]
        
        # Configure transcription with Audio Intelligence features
        config = aai.TranscriptionConfig(
            auto_chapters=True,
            summarization=True,
            summary_model=aai.SummarizationModel.informative,
            summary_type=aai.SummarizationType.bullets,
            entity_detection=True,
            sentiment_analysis=True,
            iab_categories=True,
            speaker_labels=True,
            word_boost=["AI", "machine learning", "technology", "business"],
            boost_param="high"
        )
        
        # Submit transcription job
        transcriber = aai.Transcriber(config=config)
        transcript = transcriber.transcribe(audio_path)
        
        # Wait for completion
        while transcript.status not in [aai.TranscriptStatus.completed, aai.TranscriptStatus.error]:
            await asyncio.sleep(5)
            transcript = transcriber.get_transcript(transcript.id)
        
        if transcript.status == aai.TranscriptStatus.error:
            raise Exception(f"Transcription failed: {transcript.error}")
        
        # Store transcript in database
        prisma = Prisma()
        await prisma.connect()
        
        transcript_data = {
            "text": transcript.text,
            "words": [word.dict() for word in transcript.words] if transcript.words else [],
            "chapters": [chapter.dict() for chapter in transcript.chapters] if transcript.chapters else [],
            "summary": transcript.summary,
            "entities": [entity.dict() for entity in transcript.entities] if transcript.entities else [],
            "sentiment_analysis_results": [result.dict() for result in transcript.sentiment_analysis_results] if transcript.sentiment_analysis_results else [],
            "iab_categories_result": transcript.iab_categories_result.dict() if transcript.iab_categories_result else None
        }
        
        await prisma.transcript.create(
            data={
                "jobId": job_id,
                "fullTranscript": transcript_data
            }
        )
        
        await prisma.disconnect()
        
        # Clean up temporary file
        if os.path.exists(audio_path):
            os.remove(audio_path)
        
        return transcript_data
    except Exception as e:
        activity.logger.error(f"Failed to transcribe audio: {e}")
        raise

@activity.defn(name="analyze_transcript")
async def analyze_transcript(transcript_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze transcript using LeMUR for strategic content insights."""
    try:
        transcript_text = transcript_data["text"]
        
        # Use LeMUR for advanced analysis
        prompt = f"""
        You are an expert content strategist and world-class video editor. Based on the following transcription, perform the tasks below:
        
        1. Identify the main topic, likely target audience, and overall tone (e.g., educational, humorous, inspiring).
        2. List 5-7 archetypal "Key Moment Types" that are dramatic or high-value and would make compelling clips or standalone content. These types should be specific but generic enough to be recognizable.
        
        Expected output format: a JSON object with keys "core_analysis" (containing "topic", "audience", "tone") and "highlight_types" (a list of strings describing each key moment).
        
        Transcription:
        ---
        {transcript_text}
        ---
        """
        
        response = aai.Lemur().task(
            prompt,
            final_model=aai.LemurModel.claude3_5_sonnet,
            max_output_size=2000
        )
        
        # Parse the JSON response
        try:
            analysis = json.loads(response.response)
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            analysis = {
                "core_analysis": {
                    "topic": "General content",
                    "audience": "General audience",
                    "tone": "informative"
                },
                "highlight_types": [
                    "Key insights and takeaways",
                    "Actionable advice",
                    "Personal stories or examples",
                    "Surprising facts or statistics",
                    "Controversial or debate-worthy points"
                ]
            }
        
        return analysis
    except Exception as e:
        activity.logger.error(f"Failed to analyze transcript: {e}")
        raise

@activity.defn(name="generate_content_assets")
async def generate_content_assets(
    format_type: str,
    transcript_text: str,
    summary: Dict[str, Any],
    chapters: list,
    analysis: Dict[str, Any],
    job_id: str
) -> bool:
    """Generate content assets for specific format using Google Gemini."""
    try:
        # Import Gemini service
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
        from app.services.gemini_service import GeminiService
        
        # Initialize Gemini service
        gemini = GeminiService()
        
        # Map format types to generation methods
        content = None
        tone = analysis.get('core_analysis', {}).get('tone', 'informative')
        
        if format_type == "BLOG_POST":
            prompt = f"""Act as an expert content writer. Using the provided transcription, write a 1500-word SEO-optimized blog post. 
            Structure it with a compelling hook, clear subheadings, and a conclusive summary. 
            The tone should be {tone}.

            Transcription: {transcript_text[:4000]}...
            
            Key themes: {analysis.get('highlight_types', [])}
            """
            content = await gemini.model.generate_content_async(prompt) if gemini.model else None
            
        elif format_type == "TWITTER_THREAD":
            prompt = f"""Generate a 10-tweet Twitter thread from this transcription. 
            The first tweet should be a powerful hook to grab attention. 
            Each following tweet should break down a key point or highlight, limited to 280 characters. 
            The final tweet should include a call to action. Use emojis to increase engagement.

            Transcription: {transcript_text[:3000]}...
            
            Key themes: {analysis.get('highlight_types', [])}
            """
            content = await gemini.model.generate_content_async(prompt) if gemini.model else None
            
        elif format_type == "LINKEDIN_POST":
            prompt = f"""Repurpose the main message from this transcription into a professional LinkedIn post. 
            Frame it as a personal reflection or short story to encourage comments. 
            Focus on one key learning and ask an engaging question at the end. 
            The tone should be professional and inspiring.

            Transcription: {transcript_text[:3000]}...
            
            Key themes: {analysis.get('highlight_types', [])}
            """
            content = await gemini.model.generate_content_async(prompt) if gemini.model else None
            
        elif format_type == "NEWSLETTER":
            prompt = f"""Write a 500-word summary for an email newsletter from the transcription. 
            Explain the key value proposition in a friendly, conversational tone. 
            End with a clear call to action to "watch the full video".

            Transcription: {transcript_text[:3000]}...
            
            Summary: {summary}
            """
            content = await gemini.model.generate_content_async(prompt) if gemini.model else None
            
        elif format_type == "VIDEO_HIGHLIGHTS":
            prompt = f"""Create 5 compelling video highlight descriptions with timestamps based on the key moments in this transcription. 
            Each highlight should be 30-60 seconds long and capture a high-value moment. 
            Include the exact quote and why it's compelling.

            Transcription: {transcript_text[:4000]}...
            
            Key themes: {analysis.get('highlight_types', [])}
            Chapters: {chapters}
            """
            content = await gemini.model.generate_content_async(prompt) if gemini.model else None
        
        # Fallback to demo content if Gemini is not available
        if content is None or not gemini.model:
            content_text = f"[Demo Content - Add GOOGLE_GEMINI_API_KEY to .env for real generation]\n\nFormat: {format_type}\nThis would be AI-generated content based on the video transcript."
        else:
            content_text = content.text
        
        # Store content asset in database
        prisma = Prisma()
        await prisma.connect()
        
        await prisma.contentasset.create(
            data={
                "jobId": job_id,
                "type": format_type,
                "content": content_text,
                "status": "GENERATED"
            }
        )
        
        await prisma.disconnect()
        
        return True
    except Exception as e:
        activity.logger.error(f"Failed to generate content asset {format_type}: {e}")
        # Store error message as demo content
        try:
            prisma = Prisma()
            await prisma.connect()
            await prisma.contentasset.create(
                data={
                    "jobId": job_id,
                    "type": format_type,
                    "content": f"[Demo Content] Error generating content: {str(e)}\n\nThis is placeholder content. Configure Google Gemini API for real content generation.",
                    "status": "GENERATED"
                }
            )
            await prisma.disconnect()
        except:
            pass
        raise
