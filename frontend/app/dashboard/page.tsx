'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Music,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Settings,
  LogOut,
  Crown
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { VideoSubmission } from '@/components/dashboard/VideoSubmission';
import { VideoList } from '@/components/dashboard/VideoList';
import { UsageCounter } from '@/components/dashboard/UsageCounter';

interface User {
  id: string;
  email: string;
  name?: string;
  plan?: string;
}

interface Workspace {
  id: string;
  name: string;
}

interface DashboardStats {
  videosProcessed: number;
  videosInProgress: number;
  contentGenerated: number;
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
    contentGenerated: 0
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
      <Sidebar />

      {/* Top Header with User Profile */}
      <div className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200/60 z-40">
        <div className="px-8 py-4 flex justify-end items-center">
          {user && (
            <div className="flex items-center gap-3">
              {user.plan === 'PRO' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-gray-900 text-gray-900 rounded-full text-xs font-medium">
                  <Crown className="h-3 w-3" />
                  Pro
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || user.email.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 font-light">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
            Bienvenue{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-600 text-sm font-light">
            Transformez vos vidéos en contenu viral pour toutes vos plateformes
          </p>
        </div>

        {/* Usage Counter */}
        <div className="mb-8">
          <UsageCounter />
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

        {/* Bottom Section - 2 Columns */}
        <div className="grid grid-cols-2 gap-6 mb-8">
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

          {/* Recent Videos */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Vidéos récentes</h3>
            <p className="text-xs text-gray-500 mb-6 font-light">Dernières vidéos traitées</p>

            <div className="space-y-4">
              {/* Placeholder for recent videos */}
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-light">Aucune vidéo récente</p>
                <p className="text-xs text-gray-400 mt-1">Vos vidéos traitées apparaîtront ici</p>
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
