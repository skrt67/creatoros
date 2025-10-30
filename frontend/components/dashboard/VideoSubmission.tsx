'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Upload, Youtube, AlertCircle, CheckCircle, Video, Link as LinkIcon } from 'lucide-react';

interface VideoSubmissionProps {
  workspaceId: string;
  onVideoSubmitted: () => void;
}

interface VideoPreview {
  videoId: string;
  thumbnail: string;
  title: string;
}

export function VideoSubmission({ workspaceId, onVideoSubmitted }: VideoSubmissionProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const validateVideoUrl = (url: string) => {
    const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|twitter\.com|x\.com|facebook\.com|twitch\.tv)\/.+/;
    return urlRegex.test(url);
  };

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setError('');
    setPreview(null);

    if (validateVideoUrl(url)) {
      const videoId = extractVideoId(url);
      if (videoId) {
        setLoadingPreview(true);
        setTimeout(() => {
          setPreview({
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            title: 'Prévisualisation de la vidéo'
          });
          setLoadingPreview(false);
        }, 500);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      if (uploadMode === 'url') {
        if (!videoUrl.trim()) {
          setError('Veuillez entrer une URL de vidéo');
          return;
        }

        if (!validateVideoUrl(videoUrl)) {
          setError('Veuillez entrer une URL valide (YouTube, TikTok, etc.).');
          return;
        }

        const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            youtube_url: videoUrl
          })
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess(`Vidéo soumise avec succès !`);
          setVideoUrl('');
          setPreview(null);
          onVideoSubmitted();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Échec de la soumission');
        }
      } else {
        if (!selectedFile) {
          setError('Veuillez sélectionner un fichier vidéo');
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess(`Fichier uploadé avec succès !`);
          setSelectedFile(null);
          onVideoSubmitted();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Échec de l\'upload');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">Ajouter une vidéo</h3>
        <p className="text-sm text-gray-600 font-light">
          Importez depuis YouTube, TikTok ou uploadez votre propre fichier
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            uploadMode === 'url'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <LinkIcon className="h-4 w-4" strokeWidth={1.5} />
            <span>URL</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            uploadMode === 'file'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            <span>Fichier</span>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {uploadMode === 'url' ? (
          <>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                <span className="font-medium text-gray-900">Plateformes supportées :</span> YouTube, TikTok, Instagram, Twitter/X, Facebook, Twitch
              </p>
            </div>

            <div>
              <label htmlFor="video-url" className="block text-sm font-medium text-gray-900 mb-2">
                URL de la vidéo
              </label>
              <input
                id="video-url"
                type="url"
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-900 transition-colors font-light"
                disabled={isSubmitting}
              />
            </div>

            {loadingPreview && (
              <div className="animate-pulse bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            )}

            {preview && !loadingPreview && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" strokeWidth={1.5} />
                  Prévisualisation
                </p>
                <div className="relative group">
                  <img
                    src={preview.thumbnail}
                    alt="Video thumbnail"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${preview.videoId}/mqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Youtube className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                <span className="font-medium text-gray-900">Formats supportés :</span> MP4, AVI, MOV, MKV, WEBM, FLV, WMV, M4V
              </p>
            </div>

            <div>
              <label htmlFor="video-file" className="block text-sm font-medium text-gray-900 mb-2">
                Fichier vidéo
              </label>
              <input
                id="video-file"
                type="file"
                accept="video/*,.mp4,.avi,.mov,.mkv,.webm,.flv,.wmv,.m4v"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="video-file"
                className={`block w-full px-4 py-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className={`h-10 w-10 ${selectedFile ? 'text-gray-900' : 'text-gray-400'}`} strokeWidth={1.5} />
                  <div className="text-center">
                    {selectedFile ? (
                      <>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600 mt-1 font-light">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-900">Cliquez pour sélectionner</p>
                        <p className="text-sm text-gray-600 mt-1 font-light">ou glissez-déposez votre vidéo</p>
                      </>
                    )}
                  </div>
                </div>
              </label>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 font-light"
                >
                  Supprimer
                </button>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-red-700 font-light">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-green-700 font-light">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || (uploadMode === 'url' ? !videoUrl.trim() : !selectedFile)}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Traitement en cours
            </>
          ) : (
            <>
              {uploadMode === 'url' ? 'Soumettre' : 'Uploader'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
