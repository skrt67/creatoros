import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vidova - AI Content Creation Platform',
    short_name: 'Vidova',
    description: 'Transform your YouTube videos into high-quality marketing assets with AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [],
  };
}
