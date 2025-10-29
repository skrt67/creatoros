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
    <div key={language} className="min-h-screen bg-white">
      {/* Ultra Minimal Header - Duna Style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Simple & Bold */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">CreatorOS</h1>

            {/* Right - Minimal Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t('logout')}
              </button>
              <MobileNav onLogout={handleLogout} userEmail={user?.email} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Duna Style: Spacious & Bold */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        {currentWorkspaceId ? (
          <div className="space-y-20">
            {/* Hero Section - Ultra Bold Typography */}
            <section className="py-12">
              <div className="max-w-4xl">
                <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                  {t('createAmazingContent')}
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
                  {t('transformVideos')}
                </p>
                <button
                  onClick={() => setShowVideoSubmission(!showVideoSubmission)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-xl transition-all hover:scale-[1.02]"
                >
                  {showVideoSubmission ? 'Masquer' : t('newVideo')}
                </button>
              </div>
            </section>

            {/* Video Submission Form */}
            {showVideoSubmission && (
              <div className="animate-scale-in">
                <VideoSubmission
                  workspaceId={currentWorkspaceId}
                  onVideoSubmitted={handleVideoSubmitted}
                />
              </div>
            )}

            {/* Workspace Selector - Minimal */}
            <section>
              <WorkspaceManager
                currentWorkspaceId={currentWorkspaceId}
                onWorkspaceChange={handleWorkspaceSelect}
                onWorkspaceCreated={handleWorkspaceCreated}
              />
            </section>

            {/* Video List - Full Width */}
            <section>
              <VideoList
                workspaceId={currentWorkspaceId}
                refreshTrigger={refreshTrigger}
              />
            </section>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-2xl">
              <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('workspaceSelect')}
              </h3>
              <p className="text-xl text-gray-600">
                {t('workspaceSelectDescription')}
              </p>
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
