import asyncio
from prisma import Prisma

async def check_clips():
    prisma = Prisma()
    await prisma.connect()
    try:
        # Get all content assets of type CLIPS
        clips = await prisma.contentasset.find_many(
            where={'type': 'CLIPS'}
        )
        print(f'Found {len(clips)} CLIPS assets')
        for clip in clips:
            print(f'ID: {clip.id}, Type: {clip.type}, Content length: {len(clip.content)}')
            # Try to parse the content
            import json
            try:
                data = json.loads(clip.content)
                print(f'  - Clips count: {len(data.get("clips", []))}')
            except Exception as e:
                print(f'  - Error parsing JSON: {e}')
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check_clips())
