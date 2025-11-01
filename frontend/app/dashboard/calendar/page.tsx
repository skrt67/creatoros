'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Youtube,
  Twitter,
  Linkedin,
  Instagram,
  Music,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import Cookies from 'js-cookie';

interface ScheduledPost {
  id: string;
  contentAssetId: string;
  platform: 'TWITTER' | 'LINKEDIN' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE';
  scheduledDate: Date;
  status: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  content: string;
  videoTitle?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const token = Cookies.get('access_token');
      const response = await fetch('https://api.vidova.me/calendar/scheduled-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.map((post: any) => ({
          ...post,
          scheduledDate: new Date(post.scheduledDate)
        })));
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      TWITTER: Twitter,
      LINKEDIN: Linkedin,
      INSTAGRAM: Instagram,
      TIKTOK: Music,
      YOUTUBE: Youtube
    };
    const Icon = icons[platform] || CalendarIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      TWITTER: 'bg-blue-500 text-white',
      LINKEDIN: 'bg-blue-700 text-white',
      INSTAGRAM: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      TIKTOK: 'bg-black text-white',
      YOUTUBE: 'bg-red-600 text-white'
    };
    return colors[platform] || 'bg-gray-500 text-white';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendrier de Contenu</h1>
              <p className="text-gray-600 mt-1">Planifiez et gérez vos publications</p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Planifier un post
            </button>
          </div>

          {/* Calendar Controls */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Aujourd'hui
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  view === 'month'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  view === 'week'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Semaine
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const postsForDay = getPostsForDate(day.date);
                const isToday = day.date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border-b border-r border-gray-200 ${
                      !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        !day.isCurrentMonth
                          ? 'text-gray-400'
                          : isToday
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-900'
                      }`}>
                        {day.date.getDate()}
                      </span>
                      {postsForDay.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {postsForDay.length}
                        </span>
                      )}
                    </div>

                    {/* Scheduled Posts Preview */}
                    <div className="space-y-1">
                      {postsForDay.slice(0, 3).map(post => (
                        <div
                          key={post.id}
                          className={`text-xs p-1.5 rounded ${getPlatformColor(post.platform)} truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex items-center gap-1">
                            {getPlatformIcon(post.platform)}
                            <span className="truncate">
                              {new Date(post.scheduledDate).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {postsForDay.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{postsForDay.length - 3} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Plateformes</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Twitter', platform: 'TWITTER' },
              { name: 'LinkedIn', platform: 'LINKEDIN' },
              { name: 'Instagram', platform: 'INSTAGRAM' },
              { name: 'TikTok', platform: 'TIKTOK' },
              { name: 'YouTube', platform: 'YOUTUBE' }
            ].map(({ name, platform }) => (
              <div key={platform} className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${getPlatformColor(platform)}`}>
                  {getPlatformIcon(platform)}
                </div>
                <span className="text-sm text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Posts planifiés</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {scheduledPosts.filter(p => p.status === 'SCHEDULED').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publiés ce mois</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {scheduledPosts.filter(p =>
                    p.status === 'PUBLISHED' &&
                    new Date(p.scheduledDate).getMonth() === currentDate.getMonth()
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {scheduledPosts.length > 0
                    ? Math.round((scheduledPosts.filter(p => p.status === 'PUBLISHED').length / scheduledPosts.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal - To be implemented */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Planifier une publication</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Fonctionnalité de planification en cours de développement</p>
              <p className="text-sm mt-2">Bientôt disponible !</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
