'use client';

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Clock, CheckCircle, AlertCircle, FileText, Copy, ExternalLink, Video, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ContentAssetViewer } from '@/components/video/ContentAssetViewer';

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
  created_at: string;
  updated_at: string;
  job_id: string;
}

export default function VideoDetailPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transcript' | 'content'>('transcript');
  const [regeneratingAssetId, setRegeneratingAssetId] = useState<string | null>(null);
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
    toast.success('Copié !');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const regenerateContent = async (assetId: string) => {
    try {
      setRegeneratingAssetId(assetId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/content/${assetId}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Update the specific asset in the contentAssets array
        setContentAssets(prev =>
          prev.map(asset =>
            asset.id === assetId
              ? { ...asset, content: result.data.content }
              : asset
          )
        );
        toast.success('Contenu régénéré avec succès !');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Erreur lors de la régénération');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      toast.error('Erreur lors de la régénération');
    } finally {
      setRegeneratingAssetId(null);
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
          <p className="text-gray-600 font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Vidéo non trouvée</h2>
          <Link href="/dashboard" className="text-gray-900 hover:underline font-medium">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(video.status);
  const StatusIcon = statusConfig.icon;

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
        <div className="max-w-5xl mx-auto">
          {/* Video Info Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                  {video.title || 'Sans titre'}
                </h1>
                {video.youtube_url && (
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-light">Voir sur YouTube</span>
                  </a>
                )}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} font-medium`}>
                <StatusIcon className="h-4 w-4" strokeWidth={1.5} />
                <span>{statusConfig.label}</span>
              </div>
            </div>

            {/* Thumbnail */}
            {video.youtube_url && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-6">
                <img
                  src={`https://img.youtube.com/vi/${video.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]}/maxresdefault.jpg`}
                  alt={video.title || 'Video'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-900 ml-1" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex gap-6 text-sm text-gray-600 font-light">
              <div>
                <span className="text-gray-900 font-medium">Créée le</span>{' '}
                {new Date(video.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div>
                <span className="text-gray-900 font-medium">Mise à jour</span>{' '}
                {new Date(video.updated_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Tabs & Content */}
          {video.status.toLowerCase() === 'completed' && (
            <div>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`pb-4 font-medium transition-all ${
                      activeTab === 'transcript'
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" strokeWidth={1.5} />
                      <span>Transcription</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`pb-4 font-medium transition-all ${
                      activeTab === 'content'
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" strokeWidth={1.5} />
                      <span>Contenu ({contentAssets.length})</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'transcript' ? (
                  transcript ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-light text-gray-900 tracking-tight">Transcription complète</h3>
                        <button
                          onClick={() => copyToClipboard(transcript.content)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
                        >
                          <Copy className="h-4 w-4" strokeWidth={1.5} />
                          <span>Copier</span>
                        </button>
                      </div>
                      {transcript.segments && transcript.segments.length > 0 ? (
                        <div className="space-y-3">
                          {transcript.segments.map((segment, index) => (
                            <div key={index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                              <span className="text-sm font-mono text-gray-900 font-medium whitespace-nowrap">
                                {formatTime(segment.start)}
                              </span>
                              <p className="text-gray-600 flex-1 font-light leading-relaxed">{segment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <p className="text-gray-600 font-light leading-relaxed whitespace-pre-wrap">{transcript.content}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                      <p className="text-gray-600 font-light">Transcription non disponible</p>
                    </div>
                  )
                ) : (
                  contentAssets.length > 0 ? (
                    <ContentAssetViewer assets={contentAssets} />
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                      <p className="text-gray-600 font-light">Aucun contenu généré</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
