import asyncio
from prisma import Prisma

async def check_asset_dates():
    prisma = Prisma()
    await prisma.connect()
    try:
        # Get all content assets
        assets = await prisma.contentasset.find_many(
            take=10,  # Limit to first 10 for debugging
            order={'createdAt': 'desc'}
        )
        print(f'Found {len(assets)} assets')
        for asset in assets:
            print(f'ID: {asset.id}')
            print(f'  Type: {asset.type}')
            print(f'  Status: {asset.status}')
            print(f'  CreatedAt: {asset.createdAt} (type: {type(asset.createdAt)})')
            print(f'  UpdatedAt: {asset.updatedAt} (type: {type(asset.updatedAt)})')
            print(f'  JobId: {asset.jobId}')
            print('---')
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(check_asset_dates())
