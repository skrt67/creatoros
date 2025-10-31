'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Video,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showVideoSubmission, setShowVideoSubmission] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    videosProcessed: 0,
    videosInProgress: 0,
    contentGenerated: 0,
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
          } else {
            throw new Error('No workspace found');
          }
        } else {
          throw new Error('Failed to fetch workspace');
        }

        // Get dashboard stats
        const statsResponse = await fetch(`${apiUrl}/tiktok/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDashboardStats(statsData);
        } else {
          console.warn('Failed to fetch dashboard stats, using defaults');
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

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  const handleVideoSubmitted = async () => {
    setRefreshTrigger(prev => prev + 1);
    setShowVideoSubmission(false);

    // Refresh dashboard stats
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      if (token) {
        const statsResponse = await fetch(`${apiUrl}/tiktok/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDashboardStats(statsData);
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
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 border border-gray-300 text-gray-900 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Duna Style */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-900">Vidova</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 font-light">
                <span>{user?.name || user?.email}</span>
              </div>

              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Paramètres"
              >
                <Settings className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Bienvenue{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl leading-relaxed">
            Transformez vos vidéos YouTube en contenu viral pour TikTok et Instagram.
          </p>
        </div>

        {/* Add Video CTA */}
        <div className="mb-16">
          <button
            onClick={() => setShowVideoSubmission(!showVideoSubmission)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-medium">Ajouter une vidéo</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" strokeWidth={1.5} />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-light text-gray-900 mb-2">{dashboardStats.videosProcessed}</h3>
            <p className="text-sm text-gray-600 font-light">Vidéos traitées</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-light text-gray-900 mb-2">{dashboardStats.videosInProgress}</h3>
            <p className="text-sm text-gray-600 font-light">En cours</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" strokeWidth={1.5} />
              </div>
              <TrendingUp className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-light text-gray-900 mb-2">{dashboardStats.contentGenerated}</h3>
            <p className="text-sm text-gray-600 font-light">Contenu généré</p>
          </div>
        </div>

        {/* Video Submission Form */}
        {showVideoSubmission && workspaceId && (
          <div className="mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-200/60">
            <VideoSubmission
              workspaceId={workspaceId}
              onVideoSubmitted={handleVideoSubmitted}
            />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-200/60 mb-16"></div>

        {/* Video List Section */}
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">
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
