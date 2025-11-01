'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Music, CheckCircle2, XCircle } from 'lucide-react';

export default function TikTokCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connexion à TikTok en cours...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get authorization code and state from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Connexion annulée ou refusée');
        setTimeout(() => router.push('/tiktok'), 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Code d\'autorisation ou state manquant');
        setTimeout(() => router.push('/tiktok'), 3000);
        return;
      }
      
      // Send code and state to backend
      const apiUrl = 'https://api.vidova.me';
      const response = await fetch(`${apiUrl}/tiktok/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code,
          state 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la connexion');
      }

      const data = await response.json();
      
      setStatus('success');
      setMessage(`Compte TikTok @${data.username} connecté avec succès !`);
      
      // Redirect to TikTok page after 2 seconds
      setTimeout(() => router.push('/tiktok'), 2000);

    } catch (err: any) {
      console.error('TikTok callback error:', err);
      setStatus('error');
      setMessage(err.message || 'Une erreur est survenue');
      setTimeout(() => router.push('/tiktok'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            status === 'processing' ? 'bg-gray-100' :
            status === 'success' ? 'bg-green-50 border-2 border-green-200' :
            'bg-red-50 border-2 border-red-200'
          }`}>
            {status === 'processing' && (
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-gray-900"></div>
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-10 w-10 text-green-600" strokeWidth={1.5} />
            )}
            {status === 'error' && (
              <XCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
            )}
          </div>

          <h1 className="text-3xl font-light text-gray-900 mb-4">
            {status === 'processing' && 'Connexion en cours...'}
            {status === 'success' && 'Connexion réussie !'}
            {status === 'error' && 'Erreur'}
          </h1>

          <p className="text-gray-600 font-light">
            {message}
          </p>
        </div>

        {status === 'processing' && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Music className="h-4 w-4 animate-pulse" />
            <span>Récupération des statistiques TikTok...</span>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <p className="text-sm text-gray-500 font-light">
            Redirection automatique dans quelques secondes...
          </p>
        )}
      </div>
    </div>
  );
}
