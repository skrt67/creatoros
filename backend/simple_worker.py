"""
Simple worker qui traite les vidéos en attente sans Temporal.
Utilise polling de la base de données.
"""

import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

# Ajouter le répertoire backend au path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import get_db
from app.services.video_service import VideoService
from app.services.gemini_service import GeminiService
from sqlalchemy.orm import Session

print("""
╔══════════════════════════════════════════════════════════╗
║         Vidova - Simple Worker                       ║
║         Traitement automatique des vidéos               ║
╚══════════════════════════════════════════════════════════╝
""")

async def process_pending_videos():
    """Traite les vidéos en statut pending."""
    db: Session = next(get_db())
    video_service = VideoService(db)
    gemini_service = GeminiService()
    
    try:
        # Récupérer toutes les vidéos en pending
        from app.models import Video, VideoStatus
        pending_videos = db.query(Video).filter(
            Video.status == VideoStatus.PENDING
        ).all()
        
        if not pending_videos:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✓ Aucune vidéo en attente")
            return
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 📋 {len(pending_videos)} vidéo(s) en attente")
        
        for video in pending_videos:
            try:
                print(f"\n{'='*60}")
                print(f"🎬 Traitement de la vidéo: {video.id}")
                print(f"📎 URL: {video.youtube_url}")
                print(f"{'='*60}\n")
                
                # Étape 1: Téléchargement et transcription
                print(f"[1/4] 📥 Téléchargement de l'audio...")
                video_service.update_status(video.id, VideoStatus.PROCESSING)
                
                # Télécharger la vidéo
                import yt_dlp
                ydl_opts = {
                    'format': 'bestaudio/best',
                    'outtmpl': f'/tmp/%(id)s.%(ext)s',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                    'quiet': True,
                    'no_warnings': True
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(video.youtube_url, download=True)
                    audio_path = f"/tmp/{info['id']}.mp3"
                    video_duration = info.get('duration', 0)
                    
                    # Mettre à jour les infos de la vidéo
                    video.title = info.get('title', 'Sans titre')
                    video.description = info.get('description', '')
                    video.duration = video_duration
                    video.thumbnail_url = info.get('thumbnail', '')
                    db.commit()
                
                print(f"✓ Audio téléchargé: {audio_path}")
                print(f"✓ Titre: {video.title}")
                print(f"✓ Durée: {video_duration}s")
                
                # Étape 2: Transcription
                print(f"\n[2/4] 🎤 Transcription avec Whisper...")
                import whisper
                model = whisper.load_model("base")
                result = model.transcribe(audio_path, language="fr")
                
                transcript_text = result["text"]
                segments = result.get("segments", [])
                
                # Sauvegarder la transcription
                video.transcript = transcript_text
                db.commit()
                
                print(f"✓ Transcription terminée: {len(transcript_text)} caractères")
                print(f"✓ Segments: {len(segments)}")
                
                # Étape 3: Analyse avec Gemini
                print(f"\n[3/4] 🤖 Analyse IA avec Gemini...")
                
                # Créer le contexte d'analyse
                analysis_context = f"""
Titre: {video.title}
Description: {video.description[:500] if video.description else 'N/A'}
Durée: {video_duration}s
Transcription: {transcript_text[:2000]}...
"""
                
                print(f"✓ Contexte préparé: {len(analysis_context)} caractères")
                
                # Étape 4: Génération de contenu
                print(f"\n[4/4] ✨ Génération de contenu...")
                
                # Générer différents types de contenu
                content_types = [
                    ("blog_post", "Article de blog complet"),
                    ("twitter_thread", "Thread Twitter"),
                    ("linkedin_post", "Post LinkedIn"),
                    ("newsletter", "Newsletter"),
                    ("instagram_caption", "Légende Instagram"),
                ]
                
                generated_count = 0
                for content_type, description in content_types:
                    try:
                        print(f"   → Génération: {description}...")
                        content = await gemini_service.generate_content(
                            content_type=content_type,
                            transcript=transcript_text,
                            title=video.title,
                            description=video.description or ""
                        )
                        
                        # Sauvegarder le contenu
                        from app.models import ContentAsset, ContentType
                        asset = ContentAsset(
                            video_id=video.id,
                            type=ContentType(content_type.upper()),
                            content=content,
                            title=f"{description} - {video.title}"
                        )
                        db.add(asset)
                        generated_count += 1
                        print(f"   ✓ {description}: {len(content)} caractères")
                    except Exception as e:
                        print(f"   ⚠️ Erreur {description}: {str(e)}")
                
                db.commit()
                
                # Marquer comme complété
                video_service.update_status(video.id, VideoStatus.COMPLETED)
                
                # Nettoyer le fichier temporaire
                if os.path.exists(audio_path):
                    os.remove(audio_path)
                
                print(f"\n{'='*60}")
                print(f"✅ Vidéo traitée avec succès!")
                print(f"📊 {generated_count} contenus générés")
                print(f"⏱️ Temps: {datetime.now().strftime('%H:%M:%S')}")
                print(f"{'='*60}\n")
                
            except Exception as e:
                print(f"\n❌ Erreur lors du traitement de la vidéo {video.id}:")
                print(f"   {str(e)}")
                import traceback
                traceback.print_exc()
                
                # Marquer comme échoué
                video_service.update_status(video.id, VideoStatus.FAILED)
                
    finally:
        db.close()

async def main():
    """Boucle principale du worker."""
    print("🚀 Worker démarré!")
    print("👀 Surveillance des vidéos en attente...")
    print("🔄 Polling toutes les 10 secondes")
    print("⏹️  Ctrl+C pour arrêter\n")
    
    while True:
        try:
            await process_pending_videos()
            await asyncio.sleep(10)  # Vérifier toutes les 10 secondes
        except KeyboardInterrupt:
            print("\n\n⏹️  Arrêt du worker...")
            break
        except Exception as e:
            print(f"\n❌ Erreur dans la boucle principale: {e}")
            import traceback
            traceback.print_exc()
            await asyncio.sleep(10)

if __name__ == "__main__":
    # Vérifier les dépendances
    try:
        import yt_dlp
        import whisper
    except ImportError:
        print("❌ Dépendances manquantes!")
        print("\nInstallez-les avec:")
        print("  pip install yt-dlp openai-whisper")
        sys.exit(1)
    
    asyncio.run(main())
