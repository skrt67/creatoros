'use client';

import { useState, useEffect } from 'react';
import { Plus, Video, FileText, Download, Share2, Settings, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

interface QuickActionsProps {
  workspaceId: string | null;
  onNewVideoClick?: () => void;
}

export function QuickActions({ workspaceId, onNewVideoClick }: QuickActionsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [hasVideos, setHasVideos] = useState(false);

  // Check if workspace has videos
  useEffect(() => {
    const checkVideos = async () => {
      if (!workspaceId) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const videos = await response.json();
          setHasVideos(videos.length > 0);
        }
      } catch (err) {
        console.error('Failed to check videos:', err);
      }
    };
    checkVideos();
  }, [workspaceId]);

  const handleViewContent = () => {
    if (!hasVideos) {
      toast.error('Aucune vidéo disponible. Ajoutez d\'abord une vidéo YouTube !', {
        duration: 4000,
        icon: '📹',
      });
      return;
    }
    // Scroll to video list
    const videoList = document.querySelector('[data-video-list]');
    if (videoList) {
      videoList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportAll = async () => {
    if (!hasVideos) {
      toast.error('Aucune vidéo à exporter. Ajoutez d\'abord une vidéo YouTube !', {
        duration: 4000,
        icon: '📥',
      });
      return;
    }
    
    toast.loading('Préparation de l\'export...', { id: 'export' });
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const videos = await response.json();
        const completedVideos = videos.filter((v: any) => v.status.toLowerCase() === 'completed');
        
        if (completedVideos.length === 0) {
          toast.error('Aucune vidéo terminée à exporter', { id: 'export' });
          return;
        }
        
        // Create export data
        const exportData = {
          workspace: workspaceId,
          exportDate: new Date().toISOString(),
          videos: completedVideos,
          totalVideos: completedVideos.length
        };
        
        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creatoros-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(`${completedVideos.length} vidéo(s) exportée(s) avec succès !`, { id: 'export' });
      } else {
        throw new Error('Export failed');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'export', { id: 'export' });
    }
  };

  const actions = [
    {
      icon: Video,
      label: t('quickActions.addVideo'),
      description: t('quickActions.addVideoDesc'),
      gradient: 'from-blue-500 to-blue-600',
      onClick: onNewVideoClick || (() => {}),
      primary: true
    },
    {
      icon: FileText,
      label: t('quickActions.viewContent'),
      description: t('quickActions.viewContentDesc'),
      gradient: 'from-purple-500 to-purple-600',
      onClick: handleViewContent,
    },
    {
      icon: Download,
      label: t('quickActions.exportAll'),
      description: t('quickActions.exportAllDesc'),
      gradient: 'from-green-500 to-green-600',
      onClick: handleExportAll,
    },
    {
      icon: Settings,
      label: t('quickActions.settings'),
      description: t('quickActions.settingsDesc'),
      gradient: 'from-gray-500 to-gray-600',
      onClick: () => router.push('/settings'),
    },
  ];

  const quickLinks = [
    { icon: ExternalLink, label: t('quickActions.documentation'), href: '/help' },
    { icon: Sparkles, label: t('quickActions.whatsNew'), href: '#' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">Actions Rapides</h3>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="p-4 space-y-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const isPrimary = action.primary;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={!workspaceId}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                isPrimary
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 border border-gray-200 hover:border-primary-300'
              } ${!workspaceId ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              <div className={`p-2 rounded-lg ${
                isPrimary ? 'bg-white/20' : `bg-gradient-to-br ${action.gradient}`
              }`}>
                <IconComponent className={`h-5 w-5 ${isPrimary ? 'text-white' : 'text-white'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm truncate ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
                  {action.label}
                </h4>
                <p className={`text-xs truncate ${isPrimary ? 'text-white/80' : 'text-gray-600'}`}>
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
