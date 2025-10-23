'use client';

import { useState, useEffect } from 'react';
import { Video, Clock, CheckCircle, TrendingUp, FileText, Download, ArrowUp, ArrowDown, Activity, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatCardSkeleton } from '@/components/ui/SkeletonCard';

interface StatsProps {
  workspaceId: string | null;
}

interface Stats {
  totalVideos: number;
  processingVideos: number;
  completedVideos: number;
  totalContent: number;
  recentActivity: string;
  successRate: number;
  avgProcessingTime: string;
  contentPerVideo: number;
}

export function DashboardStats({ workspaceId }: StatsProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    processingVideos: 0,
    completedVideos: 0,
    totalContent: 0,
    recentActivity: t('dashboardNoVideos'),
    successRate: 0,
    avgProcessingTime: '0min',
    contentPerVideo: 0
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (workspaceId) {
      fetchStats();
    }
  }, [workspaceId]);

  // Auto-refresh stats when there are processing videos
  useEffect(() => {
    if (!workspaceId) return;
    if (stats.processingVideos === 0) return;

    // Rafraîchir toutes les 10 secondes s'il y a des vidéos en traitement
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [workspaceId, stats.processingVideos]);

  const fetchStats = async () => {
    if (!workspaceId) return;
    
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = localStorage.getItem('auth_token');

      // Fetch videos to calculate stats
      const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const videos = await response.json();
        const processingCount = videos.filter((v: any) => 
          v.status?.toLowerCase() === 'processing'
        ).length;
        const completedCount = videos.filter((v: any) => 
          v.status?.toLowerCase() === 'completed'
        ).length;
        
        const failedCount = videos.filter((v: any) => 
          v.status?.toLowerCase() === 'failed'
        ).length;
        const successRate = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;
        const contentPerVideo = completedCount > 0 ? Math.round((completedCount * 4) / completedCount) : 0;
        
        // Déterminer l'activité récente
        let recentActivity = 'Aucune vidéo soumise';
        if (videos.length > 0) {
          const latestVideo = videos[0];
          const dateField = latestVideo.createdAt || latestVideo.created_at;
          if (dateField) {
            const date = new Date(dateField);
            const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
            if (timeAgo < 60) {
              recentActivity = `Il y a ${timeAgo} min`;
            } else if (timeAgo < 1440) {
              recentActivity = `Il y a ${Math.floor(timeAgo / 60)}h`;
            } else {
              recentActivity = date.toLocaleDateString('fr-FR');
            }
          }
        }
        
        setStats({
          totalVideos: videos.length,
          processingVideos: processingCount,
          completedVideos: completedCount,
          totalContent: completedCount * 4,
          recentActivity: recentActivity,
          successRate: successRate,
          avgProcessingTime: '~5min',
          contentPerVideo: contentPerVideo
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  if (!workspaceId) {
    return null;
  }

  const statCards = [
    {
      title: t('statsTotalVideos'),
      value: stats.totalVideos,
      subtitle: t('statsVideosSubmitted'),
      icon: Video,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      trend: '+12%',
      trendUp: true
    },
    {
      title: t('statsProcessing'),
      value: stats.processingVideos,
      subtitle: t('statsInProgress'),
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100',
      trend: stats.avgProcessingTime,
      trendUp: false
    },
    {
      title: t('statsCompleted'),
      value: stats.completedVideos,
      subtitle: `${stats.successRate}% ${t('statsSuccessRate')}`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      trend: stats.successRate > 80 ? 'Excellent' : 'Good',
      trendUp: stats.successRate > 80
    },
    {
      title: t('statsContentGenerated'),
      value: stats.totalContent,
      subtitle: `${stats.contentPerVideo} ${t('statsPerVideo')}`,
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      trend: '+8%',
      trendUp: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Statistiques</h3>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-all disabled:opacity-50"
            title="Rafraîchir"
          >
            <TrendingUp className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid - Modernized Card-based Design */}
      <div className="p-6">
        {initialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : stats.totalVideos === 0 ? (
          /* Empty State - Positive UX */
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full mb-4">
              <Zap className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Prêt à créer votre premier contenu ? 🚀
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Soumettez votre première vidéo et découvrez la puissance de l'IA pour transformer votre contenu
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">
              <span>💡 Astuce :</span>
              <span>Commencez avec une vidéo YouTube de 5-10 minutes</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                  
                  {/* Content */}
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {stat.trend && (
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                          stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {stat.trendUp && <TrendingUp className="h-3 w-3" />}
                          <span>{stat.trend}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-black text-gray-900 mb-2">
                        {loading ? '...' : stat.value}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">{stat.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
