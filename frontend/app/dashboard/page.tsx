'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, LogOut, HelpCircle, Sparkles, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoSubmission } from '@/components/dashboard/VideoSubmission';
import { VideoList } from '@/components/dashboard/VideoList';
import { WorkspaceManager } from '@/components/dashboard/WorkspaceManager';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DemoMode } from '@/components/dashboard/DemoMode';
import { MobileNav } from '@/components/layout/MobileNav';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const router = useRouter();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => setShowCommandPalette(true),
      description: 'Ouvrir la palette de commandes',
    },
    {
      key: 'n',
      ctrl: true,
      action: () => setShowVideoSubmission(true),
      description: 'Nouvelle vidéo',
    },
    {
      key: 'h',
      ctrl: true,
      action: () => router.push('/help'),
      description: t('help'),
    },
  ]);

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
    <div key={language} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">CreatorOS</h1>
                <p className="text-xs text-gray-500 font-medium">AI Content Studio</p>
              </div>
            </div>

            {/* Center - User Info */}
            {user?.email && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200/50">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{user.email}</span>
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/help')}
                className="hidden lg:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{t('help')}</span>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="hidden lg:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Settings className="h-4 w-4" />
                <span>{t('settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg transition-all shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </button>
              <MobileNav onLogout={handleLogout} userEmail={user?.email} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentWorkspaceId ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white via-primary-50/50 to-purple-50/50 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>{t('yourStudio')}</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
                        {t('createAmazingContent')}<br />
                        <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t('incredibleContent')}</span>
                      </h2>
                      <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                        {t('transformVideos')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowVideoSubmission(!showVideoSubmission)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Sparkles className="h-5 w-5" />
                          <span>{showVideoSubmission ? 'Masquer' : t('newVideo')}</span>
                        </button>
                        <button
                          onClick={() => router.push('/help')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-md border border-gray-200"
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span>{t('quickGuide')}</span>
                        </button>
                      </div>
                    </div>
                    <div className="hidden xl:block">
                      <div className="relative w-64 h-64">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute inset-8 bg-gradient-to-br from-primary-500 to-purple-700 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-16 bg-gradient-to-br from-primary-600 to-purple-800 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Workspaces + Stats */}
              <aside className="lg:col-span-1 space-y-6">
                <WorkspaceManager
                  currentWorkspaceId={currentWorkspaceId}
                  onWorkspaceChange={handleWorkspaceSelect}
                  onWorkspaceCreated={handleWorkspaceCreated}
                />
                <div className="hidden lg:block">
                  <DashboardStats workspaceId={currentWorkspaceId} />
                </div>
              </aside>

              {/* Center Column - Demo Mode + Video List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Demo Mode - Shows for first-time users */}
                <DemoMode 
                  workspaceId={currentWorkspaceId || ''}
                  onVideoSubmitted={handleVideoSubmitted}
                />
                
                <VideoList
                  workspaceId={currentWorkspaceId}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>

            {/* Quick Actions Bar (Mobile) */}
            <div className="lg:hidden">
              <QuickActions 
                workspaceId={currentWorkspaceId}
                onNewVideoClick={() => setShowVideoSubmission(!showVideoSubmission)}
              />
            </div>

            {/* Stats (Mobile) */}
            <div className="lg:hidden">
              <DashboardStats workspaceId={currentWorkspaceId} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl mb-6 animate-bounce-subtle">
                <Sparkles className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('workspaceSelect')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('workspaceSelectDescription')}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                {t('selectWorkspaceStart')}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile & Tablet) */}
      {currentWorkspaceId && (
        <div className="lg:hidden">
          <FloatingActionButton
            onClick={() => setShowVideoSubmission(!showVideoSubmission)}
            isActive={showVideoSubmission}
          />
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </div>
  );
}
