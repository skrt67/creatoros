import asyncio
from prisma import Prisma

async def check_user_videos():
    prisma = Prisma()
    await prisma.connect()
    try:
        # Get specific user
        user = await prisma.user.find_unique(
            where={'email': 'altandepl@gmail.com'},
            include={'workspaces': True}
        )

        if not user:
            print('User not found')
            return

        print(f'User: {user.email}')

        for workspace in user.workspaces:
            print(f'Workspace: {workspace.name}')

            videos = await prisma.videosource.find_many(
                where={'workspaceId': workspace.id},
                include={
                    'processingJob': {
                        'include': {'contentAssets': True}
                    }
                }
            )

            print(f'Videos: {len(videos)}')
            for video in videos:
                title = video.title or 'No title'
                clips_count = 0
                if video.processingJob and video.processingJob.contentAssets:
                    clips_count = len([a for a in video.processingJob.contentAssets if a.type == 'CLIPS'])

                print(f'  {video.id}: {title[:40]}... (CLIPS: {clips_count})')

    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check_user_videos())
