'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Music, Users, Heart, Eye, TrendingUp, RefreshCw, ExternalLink } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface TikTokStats {
  username: string;
  followers: number;
  videoCount: number;
  totalLikes: number;
  totalViews: number;
  lastSyncedAt: string;
}

export default function TikTokPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tiktokStats, setTiktokStats] = useState<TikTokStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initPage();
  }, [router]);

  const initPage = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      let token = Cookies.get('access_token');

      // If no token, allow access to TikTok page (user can connect TikTok without being logged in)
      if (!token) {
        setLoading(false);
        return;
      }

      // Get user info if token exists
      const userResponse = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Try to get TikTok stats
      const statsResponse = await fetch(`${apiUrl}/tiktok/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setTiktokStats(statsData);
      } else if (statsResponse.status === 404) {
        // TikTok account not connected yet - this is OK
        setTiktokStats(null);
      } else {
        console.warn('Failed to fetch TikTok stats:', statsResponse.status);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error initializing page:', err);
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleConnectTikTok = async () => {
    try {
      setConnecting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      
      // Get TikTok auth URL
      const response = await fetch(`${apiUrl}/tiktok/auth-url`);
      
      if (!response.ok) {
        throw new Error('Failed to get TikTok auth URL');
      }

      const data = await response.json();
      
      // Redirect to TikTok OAuth
      window.location.href = data.authUrl;
    } catch (err: any) {
      console.error('Error connecting to TikTok:', err);
      setError(err.message || 'Erreur lors de la connexion à TikTok');
      setConnecting(false);
    }
  };

  const handleSyncStats = async () => {
    try {
      setSyncing(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/tiktok/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to sync TikTok stats');
      }

      const updatedStats = await response.json();
      setTiktokStats(updatedStats);
      setSyncing(false);
    } catch (err: any) {
      console.error('Error syncing stats:', err);
      setError(err.message || 'Erreur lors de la synchronisation');
      setSyncing(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <Sidebar userName={user?.name} userEmail={user?.email} />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
              <p className="text-gray-600 font-light">Chargement...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex">
        <Sidebar userName={user?.name} userEmail={user?.email} />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-light text-gray-900 mb-4">Erreur</h1>
              <p className="text-base text-gray-600 mb-8 font-light">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar userName={user?.name} userEmail={user?.email} />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight flex items-center gap-3">
            <Music className="h-10 w-10" strokeWidth={1.5} />
            TikTok Analytics
          </h1>
          <p className="text-gray-600 text-sm font-light">
            Connectez votre compte TikTok pour accéder à vos statistiques
          </p>
        </div>

        {!tiktokStats ? (
          /* Not Connected - Show Connect Button */
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-white border border-gray-200/60 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                Connectez votre compte TikTok
              </h2>
              
              <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
                Autorisez Vidova à accéder à vos statistiques TikTok pour suivre vos performances
                et optimiser votre contenu.
              </p>

              <button
                onClick={handleConnectTikTok}
                disabled={connecting}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="font-medium">Connexion...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" strokeWidth={1.5} />
                    <span className="font-medium">Se connecter à TikTok</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-6 font-light">
                Vous serez redirigé vers TikTok pour autoriser l'accès
              </p>
            </div>
          </div>
        ) : (
          /* Connected - Show Stats */
          <div>
            {/* Account Info */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Music className="h-8 w-8 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">@{tiktokStats.username}</h3>
                    <p className="text-sm text-gray-500 font-light">
                      Dernière synchronisation : {formatDate(tiktokStats.lastSyncedAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSyncStats}
                  disabled={syncing}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                  <span className="text-sm font-medium">
                    {syncing ? 'Synchronisation...' : 'Synchroniser'}
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {/* Followers */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Abonnés</span>
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {formatNumber(tiktokStats.followers)}
                </div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Actif</span>
                </div>
              </div>

              {/* Videos */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center">
                    <Music className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Vidéos</span>
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {tiktokStats.videoCount}
                </div>
                <div className="text-sm text-gray-500">
                  Publiées
                </div>
              </div>

              {/* Likes */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-50 border border-pink-200 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">J'aime</span>
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {formatNumber(tiktokStats.totalLikes)}
                </div>
                <div className="text-sm text-gray-500">
                  Total
                </div>
              </div>

              {/* Views */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-green-600" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Vues</span>
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {formatNumber(tiktokStats.totalViews)}
                </div>
                <div className="text-sm text-gray-500">
                  Total
                </div>
              </div>
            </div>

            {/* Engagement Rate Card */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Taux d'engagement</h3>
              
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">J'aime par vidéo</p>
                  <p className="text-2xl font-light text-gray-900">
                    {tiktokStats.videoCount > 0 
                      ? formatNumber(Math.round(tiktokStats.totalLikes / tiktokStats.videoCount))
                      : '0'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Vues par vidéo</p>
                  <p className="text-2xl font-light text-gray-900">
                    {tiktokStats.videoCount > 0
                      ? formatNumber(Math.round(tiktokStats.totalViews / tiktokStats.videoCount))
                      : '0'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Taux d'engagement</p>
                  <p className="text-2xl font-light text-gray-900">
                    {tiktokStats.followers > 0
                      ? ((tiktokStats.totalLikes / tiktokStats.followers) * 100).toFixed(1) + '%'
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
