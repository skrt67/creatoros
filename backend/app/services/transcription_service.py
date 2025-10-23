"""
Transcription service using OpenAI Whisper (local) or AssemblyAI
"""
import os
import json
import tempfile
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class TranscriptionService:
    """Service for transcribing audio files."""
    
    def __init__(self):
        self.whisper_available = self._check_whisper_availability()
        # Use your AssemblyAI API key directly for now
        self.assemblyai_key = "27ddd92458e14a408d32bb80b46ebd19"
    
    def _check_whisper_availability(self) -> bool:
        """Check if OpenAI Whisper is available locally."""
        try:
            import whisper
            return True
        except ImportError:
            return False
    
    async def transcribe_audio(self, audio_file_path: str, use_timestamps: bool = True) -> Dict[str, Any]:
        """
        Transcribe audio file using available transcription service.
        
        Args:
            audio_file_path: Path to the audio file
            use_timestamps: Whether to include timestamps in the transcription
            
        Returns:
            Dict containing transcription data with segments and full text
        """
        if self.whisper_available:
            return await self._transcribe_with_whisper(audio_file_path, use_timestamps)
        elif self.assemblyai_key:
            return await self._transcribe_with_assemblyai(audio_file_path, use_timestamps)
        else:
            # Fallback to a simple mock transcription for demo
            return self._create_demo_transcription(audio_file_path)
    
    async def _transcribe_with_whisper(self, audio_file_path: str, use_timestamps: bool) -> Dict[str, Any]:
        """Transcribe using local Whisper model."""
        try:
            import whisper
            
            # Load model (you can change to larger models for better accuracy)
            model = whisper.load_model("base")
            
            # Transcribe
            result = model.transcribe(
                audio_file_path,
                word_timestamps=use_timestamps,
                verbose=False
            )
            
            # Format the result
            segments = []
            if 'segments' in result:
                for segment in result['segments']:
                    segments.append({
                        'start': segment.get('start', 0),
                        'end': segment.get('end', 0),
                        'text': segment.get('text', '').strip()
                    })
            
            return {
                'full_text': result.get('text', '').strip(),
                'segments': segments,
                'language': result.get('language', 'en'),
                'confidence': 0.9,  # Whisper doesn't provide confidence scores
                'service': 'whisper'
            }
            
        except Exception as e:
            logger.error(f"Whisper transcription failed: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")
    
    async def _transcribe_with_assemblyai(self, audio_file_path: str, use_timestamps: bool) -> Dict[str, Any]:
        """Transcribe using AssemblyAI API - based on your provided code."""
        try:
            import requests
            import time
            
            base_url = "https://api.assemblyai.com"
            headers = {"authorization": self.assemblyai_key}
            
            # Step 1: Upload audio file
            logger.info("Uploading audio file to AssemblyAI...")
            with open(audio_file_path, "rb") as f:
                upload_response = requests.post(
                    base_url + "/v2/upload",
                    headers=headers,
                    data=f
                )
            
            if upload_response.status_code != 200:
                raise Exception(f"Upload failed: {upload_response.status_code}")
            
            audio_url = upload_response.json()["upload_url"]
            logger.info(f"Audio uploaded successfully: {audio_url}")
            
            # Step 2: Request transcription with more options
            data = {
                "audio_url": audio_url,
                "speech_model": "best",  # Use best model for better accuracy
                "language_detection": True,  # Auto-detect language
                "punctuate": True,  # Add punctuation
                "format_text": True,  # Format text properly
                "disfluencies": False,  # Remove filler words like "um", "uh"
            }
            
            transcript_response = requests.post(
                base_url + "/v2/transcript", 
                json=data, 
                headers=headers
            )
            
            if transcript_response.status_code != 200:
                raise Exception(f"Transcription request failed: {transcript_response.status_code}")
            
            transcript_id = transcript_response.json()['id']
            logger.info(f"Transcription started with ID: {transcript_id}")
            
            # Step 3: Poll for results
            polling_endpoint = base_url + "/v2/transcript/" + transcript_id
            
            while True:
                result = requests.get(polling_endpoint, headers=headers).json()
                
                if result['status'] == 'completed':
                    logger.info("Transcription completed successfully!")
                    
                    full_text = result.get('text', '')
                    
                    # Use real words from AssemblyAI with timestamps
                    segments = []
                    words_data = result.get('words', [])
                    
                    if words_data:
                        # Group words into meaningful segments (sentences/paragraphs)
                        current_segment = []
                        current_start = None
                        segment_duration_target = 30000  # 30 seconds in milliseconds
                        
                        for word_info in words_data:
                            word = word_info.get('text', '')
                            start = word_info.get('start', 0)
                            end = word_info.get('end', 0)
                            confidence = word_info.get('confidence', 1.0)
                            
                            if current_start is None:
                                current_start = start
                            
                            current_segment.append(word)
                            
                            # Create a segment when we reach ~30 seconds or sentence end
                            if (end - current_start >= segment_duration_target) or word.endswith(('.', '!', '?')):
                                if current_segment:
                                    segments.append({
                                        'start': current_start / 1000.0,  # Convert to seconds
                                        'end': end / 1000.0,
                                        'text': ' '.join(current_segment).strip(),
                                        'confidence': confidence
                                    })
                                    current_segment = []
                                    current_start = None
                        
                        # Add remaining words as final segment
                        if current_segment and words_data:
                            last_word = words_data[-1]
                            segments.append({
                                'start': current_start / 1000.0 if current_start else 0,
                                'end': last_word.get('end', 0) / 1000.0,
                                'text': ' '.join(current_segment).strip(),
                                'confidence': last_word.get('confidence', 1.0)
                            })
                    else:
                        # Fallback: Create segments from sentences if no word-level data
                        sentences = full_text.split('. ')
                        segment_duration = len(sentences) * 5  # Estimate 5 seconds per sentence
                        for i, sentence in enumerate(sentences):
                            if sentence.strip():
                                start_time = i * 5
                                end_time = (i + 1) * 5
                                segments.append({
                                    'start': start_time,
                                    'end': end_time,
                                    'text': sentence.strip() + ('.' if not sentence.endswith('.') else ''),
                                    'confidence': 0.9
                                })
                    
                    return {
                        'full_text': full_text,
                        'segments': segments,
                        'language': result.get('language_code', 'en'),
                        'confidence': result.get('confidence', 0.9),
                        'service': 'assemblyai',
                        'transcript_id': transcript_id,
                        'audio_duration': result.get('audio_duration', 0)
                    }
                
                elif result['status'] == 'error':
                    raise Exception(f"Transcription failed: {result.get('error')}")
                
                else:
                    logger.info(f"Transcription status: {result['status']}")
                    time.sleep(3)
            
        except Exception as e:
            logger.error(f"AssemblyAI transcription failed: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")
    
    def _create_demo_transcription(self, audio_file_path: str) -> Dict[str, Any]:
        """Create a demo transcription when no real service is available."""
        logger.warning("No transcription service available, creating demo transcription")
        
        # Get file duration (approximate)
        try:
            import wave
            with wave.open(audio_file_path, 'r') as wav_file:
                frames = wav_file.getnframes()
                sample_rate = wav_file.getframerate()
                duration = frames / float(sample_rate)
        except:
            duration = 300  # Default 5 minutes
        
        # Create realistic demo segments
        segments = []
        segment_duration = 30  # 30 seconds per segment
        num_segments = int(duration // segment_duration) + 1
        
        demo_texts = [
            "Welcome to this video where we'll be discussing important topics.",
            "In this section, we're going to explore the main concepts and ideas.",
            "Let me explain the key points that you need to understand.",
            "This is a crucial part of our discussion today.",
            "Now we're moving on to the next important topic.",
            "Here are some practical examples that illustrate these concepts.",
            "Let's dive deeper into the technical details.",
            "This approach has proven to be very effective in practice.",
            "I want to share some insights from my experience.",
            "These are the main takeaways from our discussion today.",
        ]
        
        for i in range(min(num_segments, len(demo_texts))):
            start_time = i * segment_duration
            end_time = min(start_time + segment_duration, duration)
            segments.append({
                'start': start_time,
                'end': end_time,
                'text': demo_texts[i % len(demo_texts)]
            })
        
        full_text = ' '.join([seg['text'] for seg in segments])
        
        return {
            'full_text': full_text,
            'segments': segments,
            'language': 'en',
            'confidence': 0.85,
            'service': 'demo',
            'note': 'This is a demo transcription. Install Whisper or configure AssemblyAI for real transcription.'
        }
