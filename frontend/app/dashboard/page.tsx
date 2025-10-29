'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoSubmission } from '@/components/dashboard/VideoSubmission';
import { VideoList } from '@/components/dashboard/VideoList';
import { WorkspaceManager } from '@/components/dashboard/WorkspaceManager';

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
        let token = localStorage.getItem('auth_token');
        
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
    localStorage.removeItem('auth_token');
    localStorage.clear(); // Clear all localStorage
    
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
        const token = localStorage.getItem('auth_token');
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
    <div key={language} className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Vidova</h1>
            </div>

            {/* Center - User Info */}
            {user?.email && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/settings')}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentWorkspaceId ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {t('createAmazingContent')}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                    {t('transformVideos')}
                  </p>
                  <button
                    onClick={() => setShowVideoSubmission(!showVideoSubmission)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>{showVideoSubmission ? 'Masquer' : t('newVideo')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Submission Form */}
            {showVideoSubmission && (
              <div className="animate-scale-in">
                <VideoSubmission
                  workspaceId={currentWorkspaceId}
                  onVideoSubmitted={handleVideoSubmitted}
                />
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Workspace */}
              <aside className="lg:col-span-1">
                <WorkspaceManager
                  currentWorkspaceId={currentWorkspaceId}
                  onWorkspaceChange={handleWorkspaceSelect}
                  onWorkspaceCreated={handleWorkspaceCreated}
                />
              </aside>

              {/* Main Column - Video List */}
              <div className="lg:col-span-3">
                <VideoList
                  workspaceId={currentWorkspaceId}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">{t('workspaceSelect')}</p>
          </div>
        )}
      </main>
    </div>
  );
}
