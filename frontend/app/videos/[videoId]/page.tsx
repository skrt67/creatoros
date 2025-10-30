'use client';
import Cookies from 'js-cookie';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Download, Clock, CheckCircle, AlertCircle, FileText, Share2, Copy, ExternalLink, Zap, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VideoDetails {
  id: string;
  youtube_url: string | null;
  title: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface Transcript {
  id: string;
  content: string;
  segments: TranscriptSegment[];
}

interface ContentAsset {
  id: string;
  type: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function VideoDetailPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transcript' | 'content'>('transcript');
  const router = useRouter();

  useEffect(() => {
    fetchVideoDetails();
  }, [params.videoId]);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const videoResponse = await fetch(`${apiUrl}/videos/${params.videoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        setVideo(videoData);

        if (videoData.status.toLowerCase() === 'completed') {
          try {
            const transcriptResponse = await fetch(`${apiUrl}/videos/${params.videoId}/transcript`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (transcriptResponse.ok) {
              const transcriptData = await transcriptResponse.json();
              setTranscript(transcriptData);
            }
          } catch (err) {
            console.log('Transcript not available');
          }

          try {
            const assetsResponse = await fetch(`${apiUrl}/videos/${params.videoId}/content`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (assetsResponse.ok) {
              const assetsData = await assetsResponse.json();
              setContentAssets(assetsData);
            }
          } catch (err) {
            console.log('Content assets not available');
          }
        }
      }
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers ! 📋');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = (status: string) => {
    const normalized = status.toLowerCase();
    switch (normalized) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Terminée',
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
          border: 'border-emerald-200',
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'En cours',
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200',
        };
      case 'failed':
        return {
          icon: AlertCircle,
          label: 'Échec',
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Clock,
          label: status,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vidéo non trouvée</h2>
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-semibold">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(video.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                Vidova
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Info Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Thumbnail */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {video.youtube_url && (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]}/maxresdefault.jpg`}
                    alt={video.title || 'Video'}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/40 transition-colors">
                  <Play className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-black text-gray-900">{video.title || 'Sans titre'}</h1>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} font-semibold`}>
                  <StatusIcon className="h-5 w-5" />
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              {video.youtube_url && (
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="truncate">{video.youtube_url}</span>
                </a>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Créée le</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(video.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Mise à jour</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(video.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {video.youtube_url && (
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Play className="h-5 w-5" />
                  <span>Regarder sur YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        {video.status.toLowerCase() === 'completed' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'transcript'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Transcription</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'content'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Contenu Généré ({contentAssets.length})</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'transcript' ? (
                transcript ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Transcription complète</h3>
                      <button
                        onClick={() => copyToClipboard(transcript.content)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-lg transition-all"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copier</span>
                      </button>
                    </div>
                    {transcript.segments && transcript.segments.length > 0 ? (
                      <div className="space-y-3">
                        {transcript.segments.map((segment, index) => (
                          <div key={index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-sm font-mono text-primary-600 font-semibold whitespace-nowrap">
                              {formatTime(segment.start)}
                            </span>
                            <p className="text-gray-700 flex-1">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{transcript.content}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Transcription non disponible</p>
                  </div>
                )
              ) : (
                contentAssets.length > 0 ? (
                  <div className="space-y-4">
                    {contentAssets.map((asset) => (
                      <div key={asset.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg">
                              <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{asset.type}</h4>
                              <p className="text-xs text-gray-500">
                                {new Date(asset.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(asset.content)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-lg border border-primary-200 transition-all"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copier</span>
                          </button>
                        </div>
                        <div className="p-6">
                          <div className="prose max-w-none">
                            <div className="text-gray-700 whitespace-pre-wrap">{asset.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun contenu généré</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
