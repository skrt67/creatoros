"""
Content generation service using OpenAI GPT or local alternatives
"""
import os
import json
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ContentGenerationService:
    """Service for generating marketing content from video transcripts."""
    
    def __init__(self):
        self.openai_key = os.getenv('OPENAI_API_KEY')
        self.use_openai = self.openai_key is not None
    
    async def generate_content_from_transcript(self, transcript_text: str, video_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate marketing content from video transcript.
        
        Args:
            transcript_text: The full transcript text
            video_info: Video metadata (title, url, etc.)
            
        Returns:
            List of content assets with different types
        """
        if self.use_openai:
            return await self._generate_with_openai(transcript_text, video_info)
        else:
            return self._generate_with_templates(transcript_text, video_info)
    
    async def _generate_with_openai(self, transcript_text: str, video_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate content using OpenAI GPT API."""
        try:
            import openai
            
            client = openai.OpenAI(api_key=self.openai_key)
            
            # Extract key points from transcript
            key_points = await self._extract_key_points_openai(client, transcript_text)
            
            content_assets = []
            
            # Generate blog post
            blog_post = await self._generate_blog_post_openai(client, transcript_text, video_info, key_points)
            content_assets.append({
                "type": "BLOG_POST",
                "content": blog_post,
                "status": "GENERATED"
            })
            
            # Generate Twitter thread
            twitter_thread = await self._generate_twitter_thread_openai(client, transcript_text, video_info, key_points)
            content_assets.append({
                "type": "TWITTER_THREAD", 
                "content": twitter_thread,
                "status": "GENERATED"
            })
            
            # Generate LinkedIn post
            linkedin_post = await self._generate_linkedin_post_openai(client, transcript_text, video_info, key_points)
            content_assets.append({
                "type": "LINKEDIN_POST",
                "content": linkedin_post,
                "status": "GENERATED"
            })
            
            # Generate newsletter content
            newsletter = await self._generate_newsletter_openai(client, transcript_text, video_info, key_points)
            content_assets.append({
                "type": "NEWSLETTER",
                "content": newsletter,
                "status": "GENERATED"
            })
            
            return content_assets
            
        except Exception as e:
            logger.error(f"OpenAI content generation failed: {str(e)}")
            # Fallback to template-based generation
            return self._generate_with_templates(transcript_text, video_info)
    
    async def _extract_key_points_openai(self, client, transcript_text: str) -> List[str]:
        """Extract key points from transcript using OpenAI."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert content analyst. Extract the 5-7 most important key points from this video transcript. Return them as a simple list."},
                    {"role": "user", "content": f"Transcript: {transcript_text[:3000]}"}  # Limit to avoid token limits
                ],
                max_tokens=300,
                temperature=0.3
            )
            
            key_points_text = response.choices[0].message.content
            # Parse the key points (assuming they're in a list format)
            key_points = [point.strip() for point in key_points_text.split('\n') if point.strip() and not point.strip().startswith('#')]
            return key_points[:7]  # Limit to 7 points
            
        except Exception as e:
            logger.error(f"Key points extraction failed: {str(e)}")
            return ["Key insights from the video", "Important takeaways", "Actionable advice"]
    
    async def _generate_blog_post_openai(self, client, transcript_text: str, video_info: Dict[str, Any], key_points: List[str]) -> str:
        """Generate blog post using OpenAI."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert content writer. Create an engaging blog post based on this video transcript. Include an introduction, main points with explanations, and a conclusion. Make it informative and engaging."},
                    {"role": "user", "content": f"Video Title: {video_info.get('title', 'Video')}\nVideo URL: {video_info.get('youtube_url', '')}\nKey Points: {', '.join(key_points)}\nTranscript: {transcript_text[:2000]}"}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            blog_content = response.choices[0].message.content
            
            return f"""# {video_info.get('title', 'Video Blog Post')}

{blog_content}

---
*This blog post was generated from the video: {video_info.get('youtube_url', '')}*
*Generated by CreatorOS AI Content Generation*"""
            
        except Exception as e:
            logger.error(f"Blog post generation failed: {str(e)}")
            return f"# Blog Post: {video_info.get('title', 'Video')}\n\nContent generation failed. Please try again."
    
    async def _generate_twitter_thread_openai(self, client, transcript_text: str, video_info: Dict[str, Any], key_points: List[str]) -> str:
        """Generate Twitter thread using OpenAI."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Create a Twitter thread (3-5 tweets) based on this video content. Each tweet should be under 280 characters. Use engaging language and relevant hashtags. Number each tweet (1/5, 2/5, etc.)."},
                    {"role": "user", "content": f"Video: {video_info.get('title', '')}\nKey Points: {', '.join(key_points)}\nTranscript excerpt: {transcript_text[:1500]}"}
                ],
                max_tokens=400,
                temperature=0.8
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Twitter thread generation failed: {str(e)}")
            return "🧵 Thread about this amazing video! Check it out for valuable insights. #Content #Video"
    
    async def _generate_linkedin_post_openai(self, client, transcript_text: str, video_info: Dict[str, Any], key_points: List[str]) -> str:
        """Generate LinkedIn post using OpenAI."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Create a professional LinkedIn post based on this video content. Make it engaging, professional, and include relevant hashtags. Focus on insights and value for the professional community."},
                    {"role": "user", "content": f"Video: {video_info.get('title', '')}\nKey Points: {', '.join(key_points)}\nTranscript excerpt: {transcript_text[:1500]}"}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            linkedin_content = response.choices[0].message.content
            return f"{linkedin_content}\n\n🎬 Video: {video_info.get('youtube_url', '')}"
            
        except Exception as e:
            logger.error(f"LinkedIn post generation failed: {str(e)}")
            return f"Excited to share insights from this video: {video_info.get('title', '')} 🎬"
    
    async def _generate_newsletter_openai(self, client, transcript_text: str, video_info: Dict[str, Any], key_points: List[str]) -> str:
        """Generate newsletter content using OpenAI."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Create newsletter content based on this video. Include a compelling subject line, introduction, key takeaways, and call-to-action. Make it suitable for email marketing."},
                    {"role": "user", "content": f"Video: {video_info.get('title', '')}\nKey Points: {', '.join(key_points)}\nTranscript excerpt: {transcript_text[:1500]}"}
                ],
                max_tokens=600,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Newsletter generation failed: {str(e)}")
            return f"📧 Newsletter: New Video Content Available\n\nSubject: {video_info.get('title', 'New Video')}"
    
    def _generate_with_templates(self, transcript_text: str, video_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate content using templates when AI is not available."""
        logger.info("Using template-based content generation")
        
        # Extract first few sentences for summary
        sentences = transcript_text.split('. ')[:3]
        summary = '. '.join(sentences) + '.' if sentences else "This video contains valuable insights."
        
        # Extract some key words for hashtags
        words = transcript_text.lower().split()
        common_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'this', 'that', 'these', 'those'}
        key_words = [word for word in words if len(word) > 4 and word not in common_words][:5]
        hashtags = ' '.join([f"#{word.capitalize()}" for word in key_words[:3]])
        
        content_assets = [
            {
                "type": "BLOG_POST",
                "content": f"""# {video_info.get('title', 'Video Analysis')}

## Introduction
{summary}

## Key Insights from the Video
Based on the transcript analysis, here are the main points covered:

{self._create_bullet_points_from_transcript(transcript_text)}

## Conclusion
This video provides valuable insights that can be applied in various contexts. The content demonstrates expertise and offers practical takeaways for viewers.

---
*This blog post was generated from the video: {video_info.get('youtube_url', '')}*
*Generated by CreatorOS AI Content Generation*""",
                "status": "GENERATED"
            },
            {
                "type": "TWITTER_THREAD",
                "content": f"""🎬 Just watched an insightful video: "{video_info.get('title', 'Amazing Video')}"

Key takeaways: 
{summary[:200]}...

Worth watching! {video_info.get('youtube_url', '')}

{hashtags} #Video #Content""",
                "status": "GENERATED"
            },
            {
                "type": "LINKEDIN_POST",
                "content": f"""🎯 Sharing insights from: "{video_info.get('title', 'Professional Video')}"

{summary}

This video covers important topics that are relevant to our professional community. The insights shared can help us improve our understanding and approach.

{hashtags} #Professional #Learning #Video

🎬 Watch here: {video_info.get('youtube_url', '')}""",
                "status": "GENERATED"
            },
            {
                "type": "NEWSLETTER",
                "content": f"""📧 Newsletter Content

Subject: New Video Analysis - {video_info.get('title', 'Featured Video')}

Dear Subscriber,

We've analyzed a new video that contains valuable insights:

🎬 Video: {video_info.get('title', 'Featured Video')}

Key Summary:
{summary}

Main Topics Covered:
{self._create_bullet_points_from_transcript(transcript_text)}

This content was carefully analyzed to bring you the most relevant insights.

Watch the full video: {video_info.get('youtube_url', '')}

Best regards,
The CreatorOS Team

---
Powered by CreatorOS AI Content Generation""",
                "status": "GENERATED"
            }
        ]
        
        return content_assets
    
    def _create_bullet_points_from_transcript(self, transcript_text: str) -> str:
        """Create bullet points from transcript text."""
        # Simple approach: split into sentences and take meaningful ones
        sentences = [s.strip() for s in transcript_text.split('.') if len(s.strip()) > 20][:5]
        bullet_points = []
        
        for sentence in sentences:
            if sentence:
                bullet_points.append(f"• {sentence}")
        
        return '\n'.join(bullet_points) if bullet_points else "• Key insights from the video content"
