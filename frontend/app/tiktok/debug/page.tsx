'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function TikTokDebugPage() {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuthUrl();
  }, []);

  const fetchAuthUrl = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      
      const response = await fetch(`${apiUrl}/tiktok/auth-url`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch auth URL: ${response.status}`);
      }

      const data = await response.json();
      setAuthUrl(data.authUrl);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching auth URL:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light text-gray-900 mb-8">🔍 TikTok OAuth Debug</h1>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
            <p className="text-gray-600 mt-4">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-red-900 mb-2">❌ Erreur</h2>
            <p className="text-red-700 font-mono text-sm">{error}</p>
          </div>
        )}

        {authUrl && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-blue-900 mb-4">✅ Auth URL générée</h2>
              
              <div className="bg-white border border-blue-200 rounded p-4 mb-4 overflow-auto">
                <p className="text-sm font-mono text-gray-700 break-all">
                  {authUrl}
                </p>
              </div>

              <button
                onClick={() => window.open(authUrl, '_blank')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔗 Ouvrir l'URL OAuth
              </button>
            </div>

            {/* URL Components */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">📋 Composants de l'URL</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Base URL</p>
                  <p className="text-sm font-mono text-gray-700">https://www.tiktok.com/v2/auth/authorize/</p>
                </div>

                {authUrl.includes('client_key=') && (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Client Key</p>
                    <p className="text-sm font-mono text-gray-700">
                      {authUrl.split('client_key=')[1]?.split('&')[0]}
                    </p>
                  </div>
                )}

                {authUrl.includes('scope=') && (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Scopes</p>
                    <p className="text-sm font-mono text-gray-700">
                      {decodeURIComponent(authUrl.split('scope=')[1]?.split('&')[0] || '')}
                    </p>
                  </div>
                )}

                {authUrl.includes('redirect_uri=') && (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Redirect URI</p>
                    <p className="text-sm font-mono text-gray-700 break-all">
                      {decodeURIComponent(authUrl.split('redirect_uri=')[1]?.split('&')[0] || '')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mode Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8 mb-8">
              <h2 className="text-lg font-medium text-purple-900 mb-4">🔄 Modes de Sandbox</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border border-purple-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">🧪 Mode Sandbox (Test)</p>
                  <p className="text-xs text-gray-600 mb-2">Redirect URI :</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">http://localhost:3000/tiktok/callback</code>
                </div>
                
                <div className="bg-white p-4 rounded border border-purple-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">🚀 Mode Production</p>
                  <p className="text-xs text-gray-600 mb-2">Redirect URI :</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">https://vidova.me/tiktok/callback</code>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h2 className="text-lg font-medium text-yellow-900 mb-4">⚠️ Vérifications à faire</h2>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">1.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Redirect URI dans TikTok Developer Portal</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Pour Sandbox : <code className="bg-white px-2 py-1 rounded">http://localhost:3000/tiktok/callback</code>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Pour Production : <code className="bg-white px-2 py-1 rounded">https://vidova.me/tiktok/callback</code>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">2.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Compte de test ajouté</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Dans "Sandbox settings" → "Target Users", ajoute ton compte TikTok
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">3.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Scopes configurés</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Doit inclure : user.info.basic, video.list
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 font-bold">4.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Client Key correct</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Doit être : <code className="bg-white px-2 py-1 rounded">sbawjlojdif6x8rxin</code>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
