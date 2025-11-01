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
  BarChart3,
  Clock
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-base text-gray-600 font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
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
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-pink-600" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              TikTok Analytics
            </h1>
          </div>
          <p className="text-gray-600 text-sm font-light">Vue d'ensemble de vos performances TikTok</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-pink-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Vues Totales</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={1.5} />
              <span className="text-green-600 font-medium">+15.2%</span>
              <span className="text-gray-500 font-light">ce mois</span>
            </div>
          </div>

          {/* Total Likes */}
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">J'aime</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {(stats.totalLikes / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={1.5} />
              <span className="text-green-600 font-medium">+12.8%</span>
              <span className="text-gray-500 font-light">ce mois</span>
            </div>
          </div>

          {/* Total Comments */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Commentaires</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {(stats.totalComments / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={1.5} />
              <span className="text-green-600 font-medium">+8.5%</span>
              <span className="text-gray-500 font-light">ce mois</span>
            </div>
          </div>

          {/* Total Shares */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Partages</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {(stats.totalShares / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={1.5} />
              <span className="text-green-600 font-medium">+20.1%</span>
              <span className="text-gray-500 font-light">ce mois</span>
            </div>
          </div>
        </div>

        {/* Middle Section - 2 Columns */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Engagement Chart */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Taux d'Engagement</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-900 text-white text-xs rounded-md font-medium">7 jours</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs hover:text-gray-900 font-medium">30 jours</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs hover:text-gray-900 font-medium">90 jours</button>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-64 flex items-end gap-2 mb-4">
              {[45, 52, 48, 65, 58, 72, 68, 75, 70, 82, 78, 85, 80, 88].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-pink-300 to-pink-200 rounded-t group-hover:from-pink-400 group-hover:to-pink-300 transition-all"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-light">
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
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Vidéos Populaires</h3>

            <div className="space-y-4">
              {[
                { title: 'Comment créer du contenu viral', views: '458K', likes: '45K', engagement: '9.8%' },
                { title: 'Les secrets du TikTok algorithm', views: '392K', likes: '38K', engagement: '9.7%' },
                { title: 'Montage vidéo rapide', views: '356K', likes: '32K', engagement: '9.0%' },
                { title: 'Stratégie de contenu 2024', views: '298K', likes: '28K', engagement: '9.4%' },
              ].map((video, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-6 w-6 text-pink-700" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate mb-1">{video.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-600 font-light">
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
                      <div className="text-sm font-semibold text-green-600">{video.engagement}</div>
                      <div className="text-xs text-gray-500 font-light">engagement</div>
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
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-pink-600" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-gray-900">Vidéos Publiées</h3>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">{stats.totalVideos}</div>
            <p className="text-sm text-gray-600 mb-4 font-light">vidéos au total</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-[75%] bg-gradient-to-r from-pink-400 to-purple-400"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-light">75% des objectifs mensuels</p>
          </div>

          {/* Average Engagement Rate */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-gray-900">Taux d'Engagement</h3>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">{stats.avgEngagementRate}%</div>
            <p className="text-sm text-gray-600 mb-4 font-light">sur toutes les vidéos</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={1.5} />
              <span className="text-green-600 font-medium">+2.3%</span>
              <span className="text-gray-500 font-light">vs mois dernier</span>
            </div>
          </div>

          {/* Best Time to Post */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-gray-900">Meilleur Moment</h3>
            </div>
            <div className="text-4xl font-light text-gray-900 mb-2">18h-20h</div>
            <p className="text-sm text-gray-600 mb-4 font-light">pour publier du contenu</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-light">Lundi - Vendredi</span>
                <span className="text-gray-900 font-medium">18h-20h</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-light">Weekend</span>
                <span className="text-gray-900 font-medium">14h-16h</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
