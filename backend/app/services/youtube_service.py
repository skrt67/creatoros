"""
YouTube video processing service
"""
import os
import tempfile
import yt_dlp
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class YouTubeService:
    """Service for downloading and processing YouTube videos."""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
    
    def extract_video_info(self, youtube_url: str) -> Dict[str, Any]:
        """Extract video metadata without downloading."""
        try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                
                return {
                    'title': info.get('title', 'Unknown Title'),
                    'description': info.get('description', ''),
                    'duration': info.get('duration', 0),
                    'uploader': info.get('uploader', ''),
                    'upload_date': info.get('upload_date', ''),
                    'view_count': info.get('view_count', 0),
                    'like_count': info.get('like_count', 0),
                    'thumbnail': info.get('thumbnail', ''),
                    'video_id': info.get('id', ''),
                }
        except Exception as e:
            logger.error(f"Failed to extract video info: {str(e)}")
            raise Exception(f"Could not extract video information: {str(e)}")
    
    def download_audio(self, youtube_url: str) -> str:
        """Download audio from YouTube video."""
        try:
            # Create unique filename
            import uuid
            audio_filename = f"audio_{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(self.temp_dir, audio_filename)
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': audio_path.replace('.wav', '.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'wav',
                    'preferredquality': '192',
                }],
                'quiet': True,
                'no_warnings': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([youtube_url])
            
            # yt-dlp might create the file with a different extension
            # Check for the actual file
            base_path = audio_path.replace('.wav', '')
            for ext in ['.wav', '.m4a', '.mp3', '.webm']:
                potential_path = base_path + ext
                if os.path.exists(potential_path):
                    if ext != '.wav':
                        # Rename to .wav for consistency
                        os.rename(potential_path, audio_path)
                    return audio_path
            
            raise Exception("Audio file not found after download")
            
        except Exception as e:
            logger.error(f"Failed to download audio: {str(e)}")
            raise Exception(f"Could not download audio: {str(e)}")
    
    def cleanup_file(self, file_path: str):
        """Clean up temporary files."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up file: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")
