"""
Simple worker qui traite les vidéos en attente avec Prisma.
"""

import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

# Ajouter le répertoire backend au path
sys.path.insert(0, str(Path(__file__).parent))

from prisma import Prisma

print("""
╔══════════════════════════════════════════════════════════╗
║         Vidova - Simple Worker                       ║
║         Traitement automatique des vidéos               ║
╚══════════════════════════════════════════════════════════╝
""")

async def process_pending_videos(db: Prisma):
    """Traite les vidéos en statut PENDING."""
    
    try:
        # Récupérer toutes les vidéos PENDING
        pending_videos = await db.videosource.find_many(
            where={'status': 'PENDING'},
            include={'workspace': True}
        )
        
        if not pending_videos:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✓ Aucune vidéo en attente")
            return
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 📋 {len(pending_videos)} vidéo(s) en attente")
        
        for video in pending_videos:
            try:
                print(f"\n{'='*60}")
                print(f"🎬 Traitement de la vidéo: {video.id}")
                print(f"📎 URL: {video.youtubeUrl}")
                print(f"🏢 Workspace: {video.workspace.name if video.workspace else 'N/A'}")
                print(f"{'='*60}\n")
                
                # Vérifier si un job existe déjà pour cette vidéo
                existing_job = await db.processingjob.find_first(
                    where={'videoSourceId': video.id}
                )
                
                if existing_job:
                    print(f"⚠️  Job existant détecté, suppression...")
                    await db.processingjob.delete(where={'id': existing_job.id})
                    print(f"✓ Job supprimé")
                
                # Créer un nouveau job de traitement
                import uuid
                workflow_id = f"video-processing-{video.id}-{uuid.uuid4().hex[:8]}"
                
                job = await db.processingjob.create(
                    data={
                        'temporalWorkflowId': workflow_id,
                        'status': 'STARTED',
                        'videoSource': {
                            'connect': {'id': video.id}
                        }
                    }
                )
                
                # Mettre à jour le statut de la vidéo
                await db.videosource.update(
                    where={'id': video.id},
                    data={'status': 'PROCESSING'}
                )
                
                print(f"✓ Job créé: {job.id}")
                print(f"✓ Statut vidéo: PROCESSING")
                
                # Étape 1: Téléchargement ou extraction audio
                print(f"\n[1/4] 📥 Extraction de l'audio...")
                
                # Vérifier si c'est un fichier local ou une URL
                if video.youtubeUrl.startswith('file://'):
                    # C'est un fichier local uploadé
                    import subprocess
                    video_file_path = video.youtubeUrl.replace('file://', '')
                    print(f"✓ Fichier local détecté: {video_file_path}")
                    
                    # Vérifier si la vidéo a une piste audio
                    check_audio = subprocess.run([
                        'ffprobe', '-v', 'error', '-select_streams', 'a:0',
                        '-show_entries', 'stream=codec_type', '-of', 'csv=p=0',
                        video_file_path
                    ], capture_output=True, text=True)
                    
                    if not check_audio.stdout.strip():
                        raise Exception("La vidéo n'a pas de piste audio. Veuillez uploader une vidéo avec du son.")
                    
                    # Extraire l'audio avec ffmpeg
                    import uuid
                    audio_id = uuid.uuid4().hex[:8]
                    audio_path = f"/tmp/{audio_id}.mp3"
                    
                    result = subprocess.run([
                        'ffmpeg', '-i', video_file_path,
                        '-vn', '-acodec', 'libmp3lame',
                        '-ar', '44100', '-ac', '2', '-b:a', '192k',
                        audio_path, '-y'
                    ], capture_output=True, text=True)
                    
                    if result.returncode != 0:
                        raise Exception(f"Échec de l'extraction audio: {result.stderr[-500:]}")
                    
                    video_title = video.title or os.path.basename(video_file_path)
                    video_duration = 0  # On pourrait extraire ça avec ffprobe si besoin
                    
                    print(f"✓ Audio extrait: {audio_path}")
                    print(f"✓ Titre: {video_title}")
                else:
                    # C'est une URL (YouTube, TikTok, etc.)
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
                        info = ydl.extract_info(video.youtubeUrl, download=True)
                        audio_path = f"/tmp/{info['id']}.mp3"
                        video_duration = info.get('duration', 0)
                        video_title = info.get('title', 'Sans titre')
                        
                        # Mettre à jour le titre de la vidéo
                        await db.videosource.update(
                            where={'id': video.id},
                            data={'title': video_title}
                        )
                    
                    print(f"✓ Audio téléchargé: {audio_path}")
                    print(f"✓ Titre: {video_title}")
                    print(f"✓ Durée: {video_duration}s")
                
                # Étape 2: Transcription
                print(f"\n[2/4] 🎤 Transcription avec Whisper...")
                import whisper
                model = whisper.load_model("base")
                result = model.transcribe(audio_path, language="fr")
                
                transcript_text = result["text"]
                segments = result.get("segments", [])
                
                # Sauvegarder la transcription
                # Créer la structure de segments avec conversion en JSON
                import json
                transcript_json = {
                    'text': transcript_text,
                    'segments': [
                        {
                            'start': float(seg.get('start', 0)),
                            'end': float(seg.get('end', 0)),
                            'text': str(seg.get('text', ''))
                        }
                        for seg in segments
                    ]
                }
                
                await db.transcript.create(
                    data={
                        'fullTranscript': json.dumps(transcript_json),
                        'jobId': job.id
                    }
                )
                
                print(f"✓ Transcription terminée: {len(transcript_text)} caractères")
                print(f"✓ Segments: {len(segments)}")
                
                # Étape 3: Génération de contenu
                print(f"\n[3/4] ✨ Génération de contenu avec Gemini...")
                
                from app.services.gemini_service import GeminiService
                gemini = GeminiService()
                
                # Mapping des types de contenu vers les méthodes
                content_generators = {
                    "BLOG_POST": ("Article de blog", gemini.generate_blog_post),
                    "TWITTER_THREAD": ("Thread Twitter", gemini.generate_twitter_thread),
                    "LINKEDIN_POST": ("Post LinkedIn", gemini.generate_linkedin_post),
                    "TIKTOK": ("Script TikTok", gemini.generate_tiktok),
                }
                
                generated_count = 0
                for asset_type, (description, generator) in content_generators.items():
                    try:
                        print(f"   → Génération: {description}...")
                        result = await generator(transcript_text, video_title)
                        content = result.get('content', str(result))
                        
                        # Sauvegarder le contenu
                        await db.contentasset.create(
                            data={
                                'type': asset_type,
                                'content': content,
                                'status': 'GENERATED',
                                'jobId': job.id
                            }
                        )
                        generated_count += 1
                        print(f"   ✓ {description}: {len(content)} caractères")
                    except Exception as e:
                        print(f"   ⚠️ Erreur {description}: {str(e)}")
                
                # Étape 4: Finalisation
                print(f"\n[4/4] 🎉 Finalisation...")
                
                # Marquer comme complété
                await db.videosource.update(
                    where={'id': video.id},
                    data={'status': 'COMPLETED'}
                )
                
                await db.processingjob.update(
                    where={'id': job.id},
                    data={'status': 'COMPLETED'}
                )
                
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
                await db.videosource.update(
                    where={'id': video.id},
                    data={'status': 'FAILED'}
                )
                
                if 'job' in locals():
                    await db.processingjob.update(
                        where={'id': job.id},
                        data={'status': 'FAILED'}
                    )
                
    except Exception as e:
        print(f"❌ Erreur globale: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Boucle principale du worker."""
    print("🚀 Worker démarré!")
    print("🔌 Connexion à la base de données...")
    
    # Connexion à Prisma
    db = Prisma()
    await db.connect()
    print("✅ Base de données connectée")
    
    print("👀 Surveillance des vidéos en attente...")
    print("🔄 Polling toutes les 10 secondes")
    print("⏹️  Ctrl+C pour arrêter\n")
    
    try:
        while True:
            try:
                await process_pending_videos(db)
                await asyncio.sleep(10)  # Vérifier toutes les 10 secondes
            except KeyboardInterrupt:
                print("\n\n⏹️  Arrêt du worker...")
                break
            except Exception as e:
                print(f"\n❌ Erreur dans la boucle principale: {e}")
                import traceback
                traceback.print_exc()
                await asyncio.sleep(10)
    finally:
        await db.disconnect()
        print("✅ Base de données déconnectée")

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
