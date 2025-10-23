"""
Routes pour la progression des vidéos en temps réel.
"""

from fastapi import APIRouter, HTTPException, Depends
from prisma import Prisma
from typing import Dict, Any
import os

router = APIRouter()

# Prisma client
prisma_client: Prisma = None

def set_prisma_client(client: Prisma):
    global prisma_client
    prisma_client = client

async def get_db():
    if not prisma_client:
        raise HTTPException(status_code=500, detail="Database not connected")
    return prisma_client

@router.get("/videos/{video_id}/progress")
async def get_video_progress(
    video_id: str,
    db: Prisma = Depends(get_db)
) -> Dict[str, Any]:
    """
    Récupère la progression en temps réel d'une vidéo.
    """
    try:
        # Récupérer la vidéo avec son job
        video = await db.videosource.find_unique(
            where={'id': video_id},
            include={'processingJob': True}
        )
        
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        # Statut de la vidéo
        status = video.status
        
        # Calculer la progression basée sur le statut
        if status == 'PENDING':
            return {
                'status': 'PENDING',
                'step': 0,
                'progress': 0,
                'message': 'En attente de traitement',
                'currentStep': None
            }
        
        elif status == 'PROCESSING':
            # Si on a un job, analyser la progression
            if video.processingJob:
                job = video.processingJob
                
                # Vérifier si la transcription existe
                transcript = await db.transcript.find_first(
                    where={'jobId': job.id}
                )
                
                # Vérifier combien de contenus sont générés
                content_count = await db.contentasset.count(
                    where={'jobId': job.id}
                )
                
                # Déterminer l'étape actuelle
                if not transcript:
                    # Étape 1-2: Téléchargement/Transcription
                    return {
                        'status': 'PROCESSING',
                        'step': 1,
                        'progress': 25,
                        'message': 'Téléchargement et transcription en cours',
                        'currentStep': 'Transcription'
                    }
                elif content_count == 0:
                    # Étape 3: Analyse
                    return {
                        'status': 'PROCESSING',
                        'step': 2,
                        'progress': 50,
                        'message': 'Analyse de la transcription',
                        'currentStep': 'Analyse IA'
                    }
                elif content_count < 4:
                    # Étape 4: Génération partielle
                    progress = 50 + (content_count * 10)
                    return {
                        'status': 'PROCESSING',
                        'step': 3,
                        'progress': progress,
                        'message': f'Génération de contenu ({content_count}/4)',
                        'currentStep': 'Génération de contenu'
                    }
                else:
                    # Finalisation
                    return {
                        'status': 'PROCESSING',
                        'step': 4,
                        'progress': 95,
                        'message': 'Finalisation...',
                        'currentStep': 'Finalisation'
                    }
            else:
                # Pas de job, début du traitement
                return {
                    'status': 'PROCESSING',
                    'step': 0,
                    'progress': 10,
                    'message': 'Initialisation du traitement',
                    'currentStep': 'Téléchargement audio'
                }
        
        elif status == 'COMPLETED':
            return {
                'status': 'COMPLETED',
                'step': 4,
                'progress': 100,
                'message': 'Traitement terminé',
                'currentStep': 'Terminé'
            }
        
        elif status == 'FAILED':
            return {
                'status': 'FAILED',
                'step': 0,
                'progress': 0,
                'message': 'Le traitement a échoué',
                'currentStep': 'Erreur'
            }
        
        else:
            return {
                'status': status,
                'step': 0,
                'progress': 0,
                'message': 'Statut inconnu',
                'currentStep': None
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
