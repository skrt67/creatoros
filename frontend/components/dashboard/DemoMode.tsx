'use client';

import { useState } from 'react';
import { Play, Sparkles, ArrowRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DemoModeProps {
  workspaceId: string;
  onVideoSubmitted: () => void;
}

export function DemoMode({ workspaceId, onVideoSubmitted }: DemoModeProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    // Vérifier si l'utilisateur a déjà vu/utilisé la démo
    if (typeof window !== 'undefined') {
      return localStorage.getItem('creatoros_demo_dismissed') === 'true';
    }
    return false;
  });

  // Vidéo démo : une courte vidéo éducative qui fonctionne bien
  const demoVideo = {
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    title: '🎬 Vidéo Démo - "Me at the zoo"',
    description: 'La première vidéo YouTube - courte, simple et parfaite pour tester CreatorOS'
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('creatoros_demo_dismissed', 'true');
  };

  const handleTryDemo = async () => {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          youtube_url: demoVideo.url
        })
      });

      if (response.ok) {
        toast.success('🎉 Vidéo démo importée ! Le traitement commence...');
        handleDismiss(); // Sauvegarder et masquer définitivement
        onVideoSubmitted();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'import');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'import de la vidéo démo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-8">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
        aria-label="Fermer"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1">Mode Démo</h2>
            <p className="text-white/90 text-lg">Découvrez CreatorOS en 2 minutes</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
              <Play className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">{demoVideo.title}</h3>
              <p className="text-white/80">{demoVideo.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">1</div>
              <span>Import automatique de la vidéo</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">2</div>
              <span>Transcription avec timestamps</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">3</div>
              <span>Génération de contenu (article, posts, etc.)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleTryDemo}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-300 border-t-primary-700 rounded-full animate-spin"></div>
                <span>Import en cours...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Essayer avec la vidéo démo</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          
          <button
            onClick={handleDismiss}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/20 transition-all"
          >
            Plus tard
          </button>
        </div>

        <p className="text-xs text-white/70 mt-4 text-center">
          💡 Vous pouvez aussi importer vos propres vidéos YouTube, TikTok, ou uploader un fichier
        </p>
      </div>
    </div>
  );
}
