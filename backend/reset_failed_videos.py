"""
Script pour réinitialiser les vidéos en échec.
"""

import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    
    # Trouver toutes les vidéos FAILED
    failed_videos = await db.videosource.find_many(
        where={'status': 'FAILED'}
    )
    
    print(f"📋 Trouvé {len(failed_videos)} vidéo(s) en échec\n")
    
    for video in failed_videos:
        print(f"🔄 Réinitialisation: {video.title or video.youtubeUrl}")
        await db.videosource.update(
            where={'id': video.id},
            data={'status': 'PENDING'}
        )
        print(f"   ✓ Statut: PENDING\n")
    
    await db.disconnect()
    print(f"✅ {len(failed_videos)} vidéo(s) réinitialisée(s) !")

if __name__ == "__main__":
    asyncio.run(main())
