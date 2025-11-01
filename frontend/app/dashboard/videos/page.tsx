'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { ArrowLeft, Video, CheckCircle, Clock, AlertCircle, ExternalLink, Play, FileText, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VideoItem {
  id: string;
  youtube_url: string | null;
  title: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchVideos = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/videos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Terminée',
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-200',
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'En cours',
          color: 'text-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          color: 'text-yellow-700',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      case 'failed':
        return {
          icon: AlertCircle,
          label: 'Échec',
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Clock,
          label: status,
          color: 'text-gray-700',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Chargement des vidéos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-900">Vidova</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-light">Retour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Mes Vidéos
            </h1>
            <p className="text-lg text-gray-600 font-light">
              {videos.length} {videos.length === 1 ? 'vidéo' : 'vidéos'} au total
            </p>
          </div>

          {/* Videos Grid */}
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">Aucune vidéo</h2>
              <p className="text-gray-600 mb-8 font-light">
                Commencez par soumettre votre première vidéo depuis le dashboard
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                Aller au dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const statusConfig = getStatusConfig(video.status);
                const StatusIcon = statusConfig.icon;
                const youtubeId = video.youtube_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];

                return (
                  <Link
                    key={video.id}
                    href={`/videos/${video.id}`}
                    className="group bg-white border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300/80 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100">
                      {youtubeId ? (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                            alt={video.title || 'Video'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-6 w-6 text-gray-900 ml-1" strokeWidth={1.5} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} backdrop-blur-sm`}>
                          <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          <span className="text-xs font-medium">{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {video.title || 'Sans titre'}
                      </h3>

                      <div className="flex items-center justify-between text-sm text-gray-600 font-light mb-4">
                        <span>{new Date(video.created_at).toLocaleDateString('fr-FR')}</span>
                        {video.youtube_url && (
                          <a
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-gray-900 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span className="text-xs font-medium">YouTube</span>
                          </a>
                        )}
                      </div>

                      {/* Quick Stats */}
                      {video.status.toLowerCase() === 'completed' && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-light pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span>Transcription</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span>Contenu</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
