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
  Music,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  BarChart3
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { VideoSubmission } from '@/components/dashboard/VideoSubmission';
import { VideoList } from '@/components/dashboard/VideoList';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Workspace {
  id: string;
  name: string;
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
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showVideoSubmission, setShowVideoSubmission] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    videosProcessed: 0,
    videosInProgress: 0,
    contentGenerated: 0,
    totalReach: 0,
    totalFollowers: 0,
    totalRevenue: 0
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

        const workspacesResponse = await fetch(`${apiUrl}/workspaces`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (workspacesResponse.ok) {
          const workspacesData: Workspace[] = await workspacesResponse.json();
          if (workspacesData.length > 0) {
            setWorkspaceId(workspacesData[0].id);
          }
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

  const handleVideoSubmitted = async () => {
    setRefreshTrigger(prev => prev + 1);
    setShowVideoSubmission(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      if (token) {
        const statsResponse = await fetch(`${apiUrl}/stats/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(prev => ({ ...prev, ...statsData }));
        }
      }
    } catch (err) {
      console.error('Failed to refresh dashboard stats:', err);
    }
  };

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
      <Sidebar userName={user?.name} userEmail={user?.email} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
            Bienvenue{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-600 text-sm font-light">
            Transformez vos vidéos en contenu viral pour toutes vos plateformes
          </p>
        </div>

        {/* Add Video Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowVideoSubmission(!showVideoSubmission)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-medium">Ajouter une vidéo</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        </div>

        {/* Video Submission Form */}
        {showVideoSubmission && workspaceId && (
          <div className="mb-8">
            <VideoSubmission
              workspaceId={workspaceId}
              onVideoSubmitted={handleVideoSubmitted}
            />
          </div>
        )}

        {/* Top Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Reach Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Reach</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.totalReach?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-green-600">+10%</div>
          </div>

          {/* Followers Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Followers</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.totalFollowers?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-green-600">+4%</div>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Layers className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Content</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              {stats.contentGenerated} Uploads
            </div>
            <div className="text-sm text-green-600">+2%</div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-600">Revenue</span>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-2">
              ${stats.totalRevenue?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-green-600">+5%</div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Reach Overview */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Reach</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-900 text-white text-xs rounded-md font-medium">Monthly</button>
                <button className="px-3 py-1 text-gray-600 text-xs hover:text-gray-900 font-medium">Weekly</button>
                <button className="px-3 py-1 text-gray-600 text-xs hover:text-gray-900 font-medium">Today</button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4 font-light">Overview</p>

            {/* Chart Visualization */}
            <div className="h-48 flex items-end gap-2 mb-4">
              {[20, 40, 35, 60, 45, 80, 70, 50, 65, 75, 60, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-gray-300 to-gray-200 rounded-t hover:from-gray-400 hover:to-gray-300 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Platform Icons */}
            <div className="flex items-center justify-around pt-4 border-t border-gray-200/60">
              <Music className="h-5 w-5 text-gray-400" />
              <Youtube className="h-5 w-5 text-gray-900" />
              <Music className="h-5 w-5 text-gray-400" />
              <Music className="h-5 w-5 text-gray-900" />
            </div>
          </div>

          {/* Processing Stats */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Statut</h3>
            <p className="text-xs text-gray-500 mb-6 font-light">Traitement vidéo</p>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-3xl font-light text-gray-900">{stats.videosProcessed}</span>
                    <span className="text-sm text-gray-600 ml-2">Vidéos</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8 font-light">Traitées avec succès</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-3xl font-light text-gray-900">{stats.videosInProgress}</span>
                    <span className="text-sm text-gray-600 ml-2">Vidéos</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8 font-light">En cours de traitement</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <span className="text-3xl font-light text-gray-900">{stats.contentGenerated}</span>
                    <span className="text-sm text-gray-600 ml-2">Contenus</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-8 font-light">Générés et prêts</p>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance</h3>
            <p className="text-xs text-gray-500 mb-6 font-light">Plateformes</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Youtube className="h-5 w-5 text-gray-900" />
                  <span className="text-sm text-gray-700 font-medium">YouTube</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">60%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-gray-800 to-gray-900"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-gray-900" />
                  <span className="text-sm text-gray-700 font-medium">TikTok</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">25%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[25%] bg-gradient-to-r from-gray-600 to-gray-700"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-gray-900" />
                  <span className="text-sm text-gray-700 font-medium">Autres</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">15%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-gradient-to-r from-gray-400 to-gray-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Video List Section */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">
            Vos vidéos
          </h2>

          {workspaceId && (
            <VideoList
              workspaceId={workspaceId}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      </main>
    </div>
  );
}
