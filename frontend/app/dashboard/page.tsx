'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoSubmission } from '@/components/dashboard/VideoSubmission';
import { VideoList } from '@/components/dashboard/VideoList';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  owner_id?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showVideoSubmission, setShowVideoSubmission] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        
        // Check if user is already logged in
        let token = Cookies.get('access_token');

        // If no token, redirect to login page
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Get user info
        const userResponse = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        
        // Get workspaces
        const workspacesResponse = await fetch(`${apiUrl}/workspaces`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (workspacesResponse.ok) {
          const workspacesData = await workspacesResponse.json();
          setWorkspaces(workspacesData);
          // Set first workspace as current if none selected
          if (workspacesData.length > 0 && !currentWorkspaceId) {
            setCurrentWorkspaceId(workspacesData[0].id);
          }
        } else {
          throw new Error(`Failed to fetch workspaces: ${workspacesResponse.status}`);
        }
        
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err?.message || 'Unknown error');
        if (err?.message?.includes('401') || err?.message?.includes('Auto-login failed')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [router]);

  const handleLogout = () => {
    // Clear all auth data
    Cookies.remove('access_token');

    // Force redirect to login page
    window.location.href = '/login';
  };

  const handleWorkspaceSelect = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
  };

  const handleWorkspaceCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    // Re-fetch workspaces
    const refetchWorkspaces = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        const token = Cookies.get('access_token');
        if (!token) return;

        const response = await fetch(`${apiUrl}/workspaces`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const workspacesData = await response.json();
          setWorkspaces(workspacesData);
        }
      } catch (err) {
        console.error('Failed to refetch workspaces:', err);
      }
    };
    refetchWorkspaces();
  };

  const handleVideoSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t('loading')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('loadingTakesLong')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('error')}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {t('retry')}
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {t('goToLogin')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={language} className="min-h-screen bg-gray-50">
      {/* Sidebar - Duna Style */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Vidova</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </a>
            <a href="/dashboard/videos" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Video className="h-5 w-5" />
              Vidéos
            </a>
            <a href="/dashboard/content" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText className="h-5 w-5" />
              Contenu
            </a>
            <a href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </a>
            <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
              {t('settings')}
            </a>
          </nav>

          {/* User & Logout */}
          <div className="pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-3 px-4">{user?.email}</div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">Bienvenue, {user?.email?.split('@')[0]}</p>
            </div>
            <button
              onClick={() => setShowVideoSubmission(!showVideoSubmission)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('newVideo')}
            </button>
          </div>
        </header>

        {/* Stats & Content */}
        <div className="p-8">
          {currentWorkspaceId ? (
            <div className="space-y-8">
              {/* Video Submission Form */}
              {showVideoSubmission && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <VideoSubmission
                    workspaceId={currentWorkspaceId}
                    onVideoSubmitted={handleVideoSubmitted}
                  />
                </div>
              )}

              {/* Stats Cards - Duna Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
                  <p className="text-sm text-gray-600">Vidéos traitées</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
                  <p className="text-sm text-gray-600">En cours</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">48</h3>
                  <p className="text-sm text-gray-600">Contenu généré</p>
                </div>
              </div>

              {/* Recent Videos */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Vidéos récentes</h3>
                <VideoList
                  workspaceId={currentWorkspaceId}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sélectionnez un espace de travail</h3>
              <p className="text-gray-600">Choisissez un espace de travail pour commencer</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
