"""
Script pour nettoyer les jobs échoués.
"""

import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    
    # Trouver toutes les vidéos PENDING ou FAILED
    videos_to_clean = await db.videosource.find_many(
        where={
            'OR': [
                {'status': 'FAILED'},
                {'status': 'PENDING'}
            ]
        },
        include={'processingJob': True}
    )
    
    print(f"📋 Trouvé {len(videos_to_clean)} vidéo(s) à nettoyer\n")
    
    for video in videos_to_clean:
        # Si la vidéo a un job, le supprimer
        if video.processingJob:
            await db.processingjob.delete(
                where={'id': video.processingJob.id}
            )
            print(f"🗑️  Job supprimé pour: {video.youtubeUrl}")
        
        # Remettre en PENDING
        await db.videosource.update(
            where={'id': video.id},
            data={'status': 'PENDING'}
        )
        print(f"✓ Vidéo PENDING: {video.youtubeUrl}\n")
    
    await db.disconnect()
    print(f"✅ Nettoyage terminé!")

if __name__ == "__main__":
    asyncio.run(main())
