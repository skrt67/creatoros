import asyncio
from app.database import prisma_client

async def check_data():
    await prisma_client.connect()

    # Check user
    user = await prisma_client.user.find_unique(where={'id': 'cmhc09q6400033izd0z57rto6'})
    print(f'User: {user.email if user else None}')

    # Check workspaces
    workspaces = await prisma_client.workspace.find_many(where={'ownerId': 'cmhc09q6400033izd0z57rto6'})
    print(f'Workspaces: {len(workspaces)}')
    for ws in workspaces:
        print(f'  - {ws.name} (ID: {ws.id})')

        # Check video sources
        videos = await prisma_client.videosource.find_many(where={'workspace': {'ownerId': 'cmhc09q6400033izd0z57rto6'}})
        print(f'  - Videos: {len(videos)}')

        # Check jobs
        jobs = await prisma_client.processingjob.find_many(where={'videoSource': {'workspace': {'ownerId': 'cmhc09q6400033izd0z57rto6'}}})
        print(f'  - Jobs: {len(jobs)}')

        # Check content
        content = await prisma_client.contentasset.find_many(where={'job': {'videoSource': {'workspace': {'ownerId': 'cmhc09q6400033izd0z57rto6'}}}})
        print(f'  - Content: {len(content)}')

    await prisma_client.disconnect()

asyncio.run(check_data())
