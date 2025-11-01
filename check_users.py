import asyncio
from prisma import Prisma

async def check_user_videos():
    prisma = Prisma()
    await prisma.connect()
    try:
        # Get all users
        users = await prisma.user.find_many()
        for user in users:
            print(f'User: {user.id} - {user.email}')

            # Get user's workspaces
            workspaces = await prisma.workspace.find_many(
                where={'ownerId': user.id}
            )
            for workspace in workspaces:
                print(f'  Workspace: {workspace.id} - {workspace.name}')

                # Get videos in workspace
                videos = await prisma.videosource.find_many(
                    where={'workspaceId': workspace.id},
                    include={
                        'processingJob': {
                            'include': {'contentAssets': True}
                        }
                    }
                )

                print(f'    Videos: {len(videos)}')
                for video in videos:
                    clips_count = 0
                    if video.processingJob and video.processingJob.contentAssets:
                        clips_count = len([a for a in video.processingJob.contentAssets if a.type == 'CLIPS'])

                    print(f'      {video.id}: {video.title[:50]}... (CLIPS: {clips_count})')
                print()
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check_user_videos())
