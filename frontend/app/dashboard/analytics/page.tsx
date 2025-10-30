'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowUpRight, Users, Video, Heart, Eye } from 'lucide-react';

interface TikTokStats {
  followers: number;
  videoCount: number;
  totalLikes: number;
  totalViews: number;
  username: string;
  lastSyncedAt: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<TikTokStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchTikTokStats();
  }, []);

  const fetchTikTokStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tiktok/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 404) {
        // TikTok account not connected
        setStats(null);
      } else {
        toast.error('Erreur lors du chargement des stats');
      }
    } catch (error) {
      console.error('Error fetching TikTok stats:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectTikTok = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch('/api/tiktok/auth-url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { authUrl } = await response.json();
        window.location.href = authUrl;
      } else {
        toast.error('Erreur lors de la connexion TikTok');
      }
    } catch (error) {
      console.error('Error connecting TikTok:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tiktok/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        toast.success('Statistiques mises à jour');
      } else {
        toast.error('Erreur lors de la synchronisation');
      }
    } catch (error) {
      console.error('Error syncing stats:', error);
      toast.error('Erreur de synchronisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Analytics TikTok</h1>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Connecte ton compte TikTok</h2>
            <p className="text-gray-600 mb-8">Accède à tes statistiques personnelles et analyse tes performances</p>
            <button
              onClick={handleConnectTikTok}
              disabled={isConnecting}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isConnecting ? 'Connexion en cours...' : 'Connecter TikTok'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Analytics TikTok</h1>
            <p className="text-gray-600 mt-2">@{stats.username}</p>
          </div>
          <button
            onClick={handleSyncStats}
            disabled={isLoading}
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            Actualiser
          </button>
        </div>

        {stats.lastSyncedAt && (
          <p className="text-sm text-gray-500 mb-8">
            Dernière synchronisation : {new Date(stats.lastSyncedAt).toLocaleString('fr-FR')}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Followers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Abonnés</h3>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.followers.toLocaleString('fr-FR')}</p>
            <p className="text-sm text-gray-500 mt-2">Nombre total d'abonnés</p>
          </div>

          {/* Videos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Vidéos</h3>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.videoCount}</p>
            <p className="text-sm text-gray-500 mt-2">Nombre de vidéos publiées</p>
          </div>

          {/* Total Likes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Likes</h3>
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{(stats.totalLikes / 1000).toFixed(1)}K</p>
            <p className="text-sm text-gray-500 mt-2">Nombre total de likes</p>
          </div>

          {/* Total Views */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Vues</h3>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{(stats.totalViews / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-500 mt-2">Nombre total de vues</p>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-600 mb-2">Engagement par vidéo</p>
              <p className="text-3xl font-bold">
                {stats.videoCount > 0 
                  ? ((stats.totalLikes / stats.videoCount) / 1000).toFixed(1) 
                  : '0'}K
              </p>
              <p className="text-sm text-gray-500 mt-2">Likes en moyenne</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Vues par vidéo</p>
              <p className="text-3xl font-bold">
                {stats.videoCount > 0 
                  ? ((stats.totalViews / stats.videoCount) / 1000).toFixed(1) 
                  : '0'}K
              </p>
              <p className="text-sm text-gray-500 mt-2">Vues en moyenne</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Taux d'engagement</p>
              <p className="text-3xl font-bold">
                {stats.totalViews > 0 
                  ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(2) 
                  : '0'}%
              </p>
              <p className="text-sm text-gray-500 mt-2">Likes / Vues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
