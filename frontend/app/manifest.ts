import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CreatorOS - AI Content Creation Platform',
    short_name: 'CreatorOS',
    description: 'Transform your YouTube videos into high-quality marketing assets with AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [],
  };
}
