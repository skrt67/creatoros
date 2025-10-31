'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Eye,
  Users,
  Layers,
  DollarSign,
  Youtube,
  Twitch,
  Music,
  Gamepad2
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface DashboardStats {
  videosProcessed: number;
  videosInProgress: number;
  contentGenerated: number;
  totalReach?: number;
  totalFollowers?: number;
  totalRevenue?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    videosProcessed: 0,
    videosInProgress: 0,
    contentGenerated: 0,
    totalReach: 913711,
    totalFollowers: 541020,
    totalRevenue: 10711
  });
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
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

        // Get dashboard stats
        const statsResponse = await fetch(`${apiUrl}/stats/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(prev => ({ ...prev, ...statsData }));
        }

      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err?.message || 'Unknown error');
        if (err?.message?.includes('401')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
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
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight uppercase">
            {user?.name || user?.email?.split('@')[0] || 'CREATOR'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>June 1 - July 1</span>
            <span>2023</span>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Reach Card */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Reach</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.totalReach?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-emerald-400">+10%</div>
          </div>

          {/* Followers Card */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Followers</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.totalFollowers?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-emerald-400">+4%</div>
          </div>

          {/* Content Card */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Content</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.contentGenerated} Uploads
            </div>
            <div className="text-sm text-emerald-400">+2%</div>
          </div>

          {/* Revenue Card */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${stats.totalRevenue?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-emerald-400">+5%</div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-6">
          {/* Reach Overview */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Reach</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-md">Monthly</button>
                <button className="px-3 py-1 text-gray-400 text-xs hover:text-white">Weekly</button>
                <button className="px-3 py-1 text-gray-400 text-xs hover:text-white">Today</button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">Overview</p>

            {/* Simple Chart Visualization */}
            <div className="h-48 flex items-end gap-2 mb-4">
              {[20, 40, 35, 60, 45, 80, 70, 50, 65, 75, 60, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-gray-700 to-gray-600 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Platform Icons */}
            <div className="flex items-center justify-around pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <Twitch className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Content Overview */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
            <p className="text-xs text-gray-500 mb-6">Overview</p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="text-3xl font-bold text-emerald-400">3</span>
                    <span className="text-sm text-gray-400 ml-2">Videos</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8">Youtube</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="text-3xl font-bold text-emerald-400">1</span>
                    <span className="text-sm text-gray-400 ml-2">Short Form</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8">YouTube Shorts | TikTok</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="text-3xl font-bold text-emerald-400">2</span>
                    <span className="text-sm text-gray-400 ml-2">Posts</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8">Twitter</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="text-3xl font-bold text-emerald-400">12</span>
                    <span className="text-sm text-gray-400 ml-2">Stream Hours</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8">Twitch | YouTube Live</p>
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Revenue</h3>
            <p className="text-xs text-gray-500 mb-6">Overview</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Youtube className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm text-gray-300">Sponsored Ads</span>
                </div>
                <span className="text-sm font-semibold text-white">60%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Twitch className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-300">Subscribers Ads</span>
                </div>
                <span className="text-sm font-semibold text-white">25%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[25%] bg-gradient-to-r from-gray-600 to-gray-700"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-gray-300">Patreons</span>
                </div>
                <span className="text-sm font-semibold text-white">15%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-5 gap-4 mt-8">
          {/* Active Platform - YouTube Gaming */}
          <div className="bg-[#1a1a1a] border-2 border-emerald-500 rounded-2xl p-6 hover:border-emerald-400 transition-all cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Videolytical</h4>
              <p className="text-sm text-emerald-400">+10%</p>
            </div>
          </div>

          {/* Inactive Platform */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all cursor-pointer opacity-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Youtube className="h-8 w-8 text-gray-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-400 mb-1">Chefaholic</h4>
              <p className="text-sm text-gray-600">-17%</p>
            </div>
          </div>

          {/* Inactive Platform */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all cursor-pointer opacity-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="h-8 w-8 text-gray-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-400 mb-1">Videolytical</h4>
              <p className="text-sm text-gray-600">+5%</p>
            </div>
          </div>

          {/* Inactive Platform */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all cursor-pointer opacity-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Music className="h-8 w-8 text-gray-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-400 mb-1">Videolytical</h4>
              <p className="text-sm text-gray-600">+37%</p>
            </div>
          </div>

          {/* Add Platform */}
          <div className="bg-[#1a1a1a] border border-dashed border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <div className="text-5xl text-gray-600">+</div>
              </div>
              <p className="text-sm text-gray-500 uppercase text-center">Add<br/>Platform</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
