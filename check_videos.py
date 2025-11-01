import asyncio
from prisma import Prisma

async def check_video_content():
    prisma = Prisma()
    await prisma.connect()
    try:
        # Get videos with CLIPS content assets
        videos = await prisma.videosource.find_many(
            where={'status': 'COMPLETED'},
            include={
                'processingJob': {
                    'include': {'contentAssets': True}
                }
            }
        )

        for video in videos:
            print(f'Video: {video.id} - {video.title}')
            if video.processingJob and video.processingJob.contentAssets:
                clips_assets = [asset for asset in video.processingJob.contentAssets if asset.type == 'CLIPS']
                print(f'  - CLIPS assets: {len(clips_assets)}')
                for asset in clips_assets:
                    print(f'    Asset ID: {asset.id}')
            else:
                print('  - No processing job or no assets')
            print()
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check_video_content())
