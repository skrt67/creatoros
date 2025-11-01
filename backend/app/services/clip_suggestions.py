"""
Video Clip Suggestions Service
Analyzes transcripts to suggest viral-worthy short clips
"""
import logging
import json
import re
from typing import Dict, List, Any
import google.generativeai as genai

logger = logging.getLogger(__name__)


async def suggest_viral_clips(model, transcript: str, video_title: str, duration_seconds: int = 60) -> Dict[str, Any]:
    """
    Analyze transcript and suggest 3-5 viral-worthy clip moments.
    Each clip includes timestamp, reason, catchy title, and virality score.
    """
    logger.info(f"Analyzing video for clip suggestions: {video_title}")

    prompt = f'''ANALYSE DE CLIPS VIRAUX POUR SHORTS/REELS

Tu es un expert en création de contenu court viral (TikTok, YouTube Shorts, Instagram Reels).

VIDÉO: {video_title}

TRANSCRIPTION:
{transcript}

MISSION:
Identifie les 3 à 5 MEILLEURS moments de cette vidéo qui feraient des clips courts viraux ({duration_seconds} secondes max).

CRITÈRES DE SÉLECTION:
- Moment autonome (compréhensible sans contexte)
- Hook fort dans les 3 premières secondes
- Valeur immédiate (astuce, révélation, punchline, émotion forte)
- Potentiel de partage et commentaires
- Citation mémorable OU information surprenante OU moment drôle/émouvant

POUR CHAQUE CLIP, FOURNIS:

1. **TIMESTAMP** (format: MM:SS - MM:SS)
   - Début et fin PRÉCIS du clip
   - Durée entre 15 et 60 secondes

2. **TITRE ACCROCHEUR** (max 60 caractères)
   - Style clickbait intelligent
   - Intrigue + bénéfice

3. **RAISON** (1 phrase)
   - Pourquoi ce moment a un potentiel viral
   - Type: Moment viral | Citation forte | Astuce pratique | Révélation | Émotion | Controverse

4. **HOOK** (première phrase du clip)
   - Les 3-5 premiers mots qui captent l'attention
   - Doit donner envie de regarder jusqu'à la fin

5. **SCORE VIRAL** (sur 10)
   - Évalue le potentiel viral objectivement
   - Critères: hook, valeur, émotion, partageabilité

FORMAT DE SORTIE (JSON):
{{
  "clips": [
    {{
      "timestamp_start": "MM:SS",
      "timestamp_end": "MM:SS",
      "duration_seconds": 30,
      "title": "Titre accrocheur ici",
      "hook": "Premières secondes du clip",
      "reason": "Type de moment viral",
      "viral_score": 8,
      "platform_optimized": ["tiktok", "youtube_shorts", "instagram_reels"]
    }}
  ],
  "best_clip_index": 0,
  "total_analyzed": 1,
  "recommendations": "Conseil général pour monter ces clips"
}}

INSTRUCTIONS:
- Privilégie la QUALITÉ sur la quantité (3-5 clips MAX)
- Sois sélectif : seuls les moments vraiment viraux
- Pense en termes de scroll-stopping power
- Évite les transitions ou moments flous
- Cherche les quotables et les moments mémorables

GÉNÈRE L'ANALYSE COMPLÈTE.'''

    try:
        response = model.generate_content(prompt)
        content = response.text

        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = content

        try:
            clips_data = json.loads(json_str)
        except:
            # Fallback if JSON parsing fails
            clips_data = {
                "clips": [],
                "best_clip_index": 0,
                "total_analyzed": 0,
                "recommendations": "Unable to parse clip suggestions",
                "raw_response": content
            }

        logger.info(f"Generated {len(clips_data.get('clips', []))} clip suggestions")

        return {
            "type": "clip_suggestions",
            "data": clips_data,
            "video_title": video_title,
            "status": "generated",
            "service": "gemini",
            "quality": "premium"
        }

    except Exception as e:
        logger.error(f"Gemini clip suggestion failed: {str(e)}")
        return {
            "type": "clip_suggestions",
            "data": {
                "clips": [],
                "error": str(e)
            },
            "status": "failed"
        }
