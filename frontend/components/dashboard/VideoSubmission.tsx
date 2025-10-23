'use client';

import { useState } from 'react';
import { Upload, Youtube, AlertCircle, CheckCircle, Video } from 'lucide-react';

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
    // Support YouTube, TikTok, Instagram, Twitter, etc. (toutes les plateformes supportées par yt-dlp)
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
        // Simuler le chargement puis afficher preview
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
      const token = localStorage.getItem('auth_token');

      if (uploadMode === 'url') {
        // Mode URL
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
          setSuccess(`Vidéo soumise avec succès ! 🎉`);
          setVideoUrl('');
          setPreview(null);
          onVideoSubmitted();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Échec de la soumission');
        }
      } else {
        // Mode Upload de fichier
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
          setSuccess(`Fichier uploadé avec succès ! 🎉 (${result.data.filename})`);
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Video className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Soumettre une vidéo</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Youtube className="h-4 w-4" />
          <span>+ TikTok, Instagram, Twitter...</span>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            uploadMode === 'url'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Youtube className="h-4 w-4" />
            <span>URL Vidéo</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            uploadMode === 'file'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Fichier</span>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {uploadMode === 'url' ? (
          <>
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Video className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Plateformes supportées :</p>
                  <p className="text-blue-600">YouTube, TikTok, Instagram, Twitter/X, Facebook, Twitch et plus encore...</p>
                </div>
              </div>
            </div>

        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
            URL de la vidéo
          </label>
          <div className="relative">
            <input
              id="video-url"
              type="url"
              value={videoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/... ou https://www.tiktok.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <Upload className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 Collez simplement l'URL de la vidéo depuis votre plateforme préférée
          </p>
        </div>

            {/* Preview Section */}
        {loadingPreview && (
          <div className="animate-pulse bg-gray-100 rounded-xl p-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}

        {preview && !loadingPreview && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-primary-200">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Prévisualisation de la vidéo
            </p>
            <div className="relative group">
              <img 
                src={preview.thumbnail}
                alt="Video thumbnail"
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${preview.videoId}/mqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Youtube className="h-16 w-16 text-white opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <a 
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              Voir sur YouTube →
            </a>
          </div>
        )}
          </>
        ) : (
          <>
            {/* File Upload Mode */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
              <div className="flex items-start gap-2">
                <Upload className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Formats supportés :</p>
                  <p className="text-purple-600">MP4, AVI, MOV, MKV, WEBM, FLV, WMV, M4V</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="video-file" className="block text-sm font-medium text-gray-700 mb-2">
                Fichier vidéo
              </label>
              <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                ⚠️ <strong>Important :</strong> La vidéo doit contenir une piste audio pour être transcrite.
              </div>
              <div className="relative">
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
                  className={`block w-full px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className={`h-12 w-12 ${selectedFile ? 'text-primary-600' : 'text-gray-400'}`} />
                    <div className="text-center">
                      {selectedFile ? (
                        <>
                          <p className="font-semibold text-primary-700">{selectedFile.name}</p>
                          <p className="text-sm text-primary-600 mt-1">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-700">Cliquez pour sélectionner</p>
                          <p className="text-sm text-gray-500 mt-1">ou glissez-déposez votre vidéo ici</p>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  ✕ Supprimer
                </button>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || (uploadMode === 'url' ? !videoUrl.trim() : !selectedFile)}
          className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Traitement en cours...
            </>
          ) : (
            <>
              {uploadMode === 'url' ? <Youtube className="h-5 w-5 mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
              {uploadMode === 'url' ? 'Soumettre la vidéo' : 'Uploader et transcrire'}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong className="text-primary-600">💡 Comment ça marche :</strong> {uploadMode === 'url' 
            ? 'Collez une URL depuis YouTube, TikTok, Instagram, ou toute autre plateforme supportée.'
            : 'Uploadez votre propre fichier vidéo (MP4, MOV, etc.).'
          } Notre IA va automatiquement extraire l'audio, générer une transcription précise, et créer du contenu optimisé pour vos besoins marketing !
        </p>
      </div>
    </div>
  );
}
