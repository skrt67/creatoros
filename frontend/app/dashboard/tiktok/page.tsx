'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface TikTokStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalVideos: number;
  avgEngagementRate: number;
  topVideo?: {
    title: string;
    views: number;
    likes: number;
  };
}

export default function TikTokStatsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<TikTokStats>({
    totalViews: 2450000,
    totalLikes: 245000,
    totalComments: 12300,
    totalShares: 8500,
    totalVideos: 42,
    avgEngagementRate: 8.5,
  });
  const router = useRouter();

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        let token = Cookies.get('access_token');

        if (!token) {
          router.push('/login');
          return;
        }

        const userResponse = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user info');
        }

      } catch (err: any) {
        console.error('TikTok Stats error:', err);
        setError(err?.message || 'Unknown error');
        if (err?.message?.includes('401')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-base text-gray-400 font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-light text-white mb-4">Erreur</h1>
          <p className="text-base text-gray-400 mb-8 font-light">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <Sidebar userName={user?.name} userEmail={user?.email} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase">
              TikTok Analytics
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Vue d'ensemble de vos performances TikTok</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-400">Vues Totales</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">+15.2%</span>
              <span className="text-gray-500">ce mois</span>
            </div>
          </div>

          {/* Total Likes */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-400">J'aime</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {(stats.totalLikes / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">+12.8%</span>
              <span className="text-gray-500">ce mois</span>
            </div>
          </div>

          {/* Total Comments */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-400">Commentaires</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {(stats.totalComments / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">+8.5%</span>
              <span className="text-gray-500">ce mois</span>
            </div>
          </div>

          {/* Total Shares */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-400">Partages</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {(stats.totalShares / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">+20.1%</span>
              <span className="text-gray-500">ce mois</span>
            </div>
          </div>
        </div>

        {/* Middle Section - 2 Columns */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Engagement Chart */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Taux d'Engagement</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-pink-500 text-white text-xs rounded-md">7 jours</button>
                <button className="px-3 py-1 text-gray-400 text-xs hover:text-white">30 jours</button>
                <button className="px-3 py-1 text-gray-400 text-xs hover:text-white">90 jours</button>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-64 flex items-end gap-2 mb-4">
              {[45, 52, 48, 65, 58, 72, 68, 75, 70, 82, 78, 85, 80, 88].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-t group-hover:from-pink-400 group-hover:to-purple-400 transition-all"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mer</span>
              <span>Jeu</span>
              <span>Ven</span>
              <span>Sam</span>
              <span>Dim</span>
            </div>
          </div>

          {/* Top Performing Videos */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Vidéos Populaires</h3>

            <div className="space-y-4">
              {[
                { title: 'Comment créer du contenu viral', views: '458K', likes: '45K', engagement: '9.8%' },
                { title: 'Les secrets du TikTok algorithm', views: '392K', likes: '38K', engagement: '9.7%' },
                { title: 'Montage vidéo rapide', views: '356K', likes: '32K', engagement: '9.0%' },
                { title: 'Stratégie de contenu 2024', views: '298K', likes: '28K', engagement: '9.4%' },
              ].map((video, i) => (
                <div key={i} className="bg-[#151515] border border-gray-800 rounded-xl p-4 hover:border-pink-500/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate mb-1">{video.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {video.likes}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-400">{video.engagement}</div>
                      <div className="text-xs text-gray-500">engagement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Performance Metrics */}
        <div className="grid grid-cols-3 gap-6">
          {/* Videos Published */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">Vidéos Publiées</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalVideos}</div>
            <p className="text-sm text-gray-400 mb-4">vidéos au total</p>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-[75%] bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">75% des objectifs mensuels</p>
          </div>

          {/* Average Engagement Rate */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Taux d'Engagement Moyen</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.avgEngagementRate}%</div>
            <p className="text-sm text-gray-400 mb-4">sur toutes les vidéos</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">+2.3%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>

          {/* Best Time to Post */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Meilleur Moment</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">18h-20h</div>
            <p className="text-sm text-gray-400 mb-4">pour publier du contenu</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Lundi - Vendredi</span>
                <span className="text-white font-medium">18h-20h</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Weekend</span>
                <span className="text-white font-medium">14h-16h</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
