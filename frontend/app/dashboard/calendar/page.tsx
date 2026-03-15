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

interface ContentAsset {
  id: string;
  type: string;
  content: string;
  videoTitle: string;
  createdAt: string;
  scheduledCount: number;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [availableContent, setAvailableContent] = useState<ContentAsset[]>([]);
  const [selectedContentId, setSelectedContentId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchScheduledPosts();
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';

  const fetchUser = async () => {
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchScheduledPosts = async () => {
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`${apiUrl}/calendar/scheduled-posts`, {
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

  const fetchAvailableContent = async () => {
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`${apiUrl}/calendar/available-content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableContent(data);
      }
    } catch (error) {
      console.error('Error fetching available content:', error);
    }
  };

  const handleOpenScheduleModal = () => {
    fetchAvailableContent();
    setSelectedContentId('');
    setSelectedPlatform('');
    setScheduleDate('');
    setScheduleTime('');
    setShowScheduleModal(true);
  };

  const handleSchedulePost = async () => {
    if (!selectedContentId || !selectedPlatform || !scheduleDate || !scheduleTime) return;

    setScheduling(true);
    try {
      const token = Cookies.get('access_token');
      const scheduledDate = new Date(`${scheduleDate}T${scheduleTime}`);

      const response = await fetch(`${apiUrl}/calendar/schedule-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentAssetId: selectedContentId,
          platform: selectedPlatform,
          scheduledDate: scheduledDate.toISOString()
        })
      });

      if (response.ok) {
        setShowScheduleModal(false);
        fetchScheduledPosts();
      } else {
        const err = await response.json();
        alert(err.detail || 'Erreur lors de la planification');
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Erreur lors de la planification');
    } finally {
      setScheduling(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Supprimer cette publication planifiée ?')) return;

    setDeletingPostId(postId);
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`${apiUrl}/calendar/scheduled-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setScheduledPosts(prev => prev.filter(p => p.id !== postId));
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeletingPostId(null);
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

  const goToPrevious = () => {
    if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      goToPreviousMonth();
    }
  };

  const goToNext = () => {
    if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      goToNextMonth();
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(start.getDate() - day);
    const weekDaysArr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      weekDaysArr.push(d);
    }
    return weekDaysArr;
  };

  const getHeaderLabel = () => {
    if (view === 'week') {
      const week = getWeekDays(currentDate);
      const start = week[0];
      const end = week[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

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
              onClick={handleOpenScheduleModal}
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
                onClick={goToPrevious}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 min-w-[280px] text-center">
                {getHeaderLabel()}
              </h2>

              <button
                onClick={goToNext}
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
        ) : view === 'month' ? (
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
                          onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
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
        ) : (
          /* Week View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Week Days Header */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200">
              <div className="p-3 bg-gray-50"></div>
              {getWeekDays(currentDate).map((day, i) => {
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <div key={i} className={`p-3 text-center border-l border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">{weekDays[day.getDay()]}</div>
                    <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="max-h-[600px] overflow-y-auto">
              {hours.map(hour => {
                const weekDaysArr = getWeekDays(currentDate);
                return (
                  <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 min-h-[48px]">
                    <div className="p-1 text-xs text-gray-400 text-right pr-2 pt-1">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    {weekDaysArr.map((day, dayIdx) => {
                      const postsThisHour = getPostsForDate(day).filter(post => {
                        const h = new Date(post.scheduledDate).getHours();
                        return h === hour;
                      });
                      return (
                        <div
                          key={dayIdx}
                          className="border-l border-gray-100 p-1 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            const d = new Date(day);
                            d.setHours(hour, 0);
                            setSelectedDate(d);
                          }}
                        >
                          {postsThisHour.map(post => (
                            <div
                              key={post.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                              className={`text-xs p-1 rounded mb-1 ${getPlatformColor(post.platform)} cursor-pointer hover:opacity-80`}
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
                        </div>
                      );
                    })}
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

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Planifier une publication</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              {availableContent.length === 0 ? (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Aucun contenu disponible. Traitez d'abord une vidéo pour générer du contenu.
                </p>
              ) : (
                <select
                  value={selectedContentId}
                  onChange={(e) => setSelectedContentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Sélectionner un contenu...</option>
                  {availableContent.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.type}] {asset.videoTitle} - {asset.content.slice(0, 60)}...
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Platform Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Plateforme</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'TWITTER', name: 'Twitter', icon: Twitter },
                  { id: 'LINKEDIN', name: 'LinkedIn', icon: Linkedin },
                  { id: 'INSTAGRAM', name: 'Instagram', icon: Instagram },
                  { id: 'TIKTOK', name: 'TikTok', icon: Music },
                  { id: 'YOUTUBE', name: 'YouTube', icon: Youtube }
                ].map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPlatform(id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                      selectedPlatform === id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Preview */}
            {selectedContentId && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 mb-1">Aperçu du contenu</p>
                <p className="text-sm text-gray-700">
                  {availableContent.find(a => a.id === selectedContentId)?.content}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSchedulePost}
                disabled={!selectedContentId || !selectedPlatform || !scheduleDate || !scheduleTime || scheduling}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scheduling ? 'Planification...' : 'Planifier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded ${getPlatformColor(selectedPost.platform)}`}>
                  {getPlatformIcon(selectedPost.platform)}
                </div>
                <h3 className="text-lg font-semibold">{selectedPost.platform}</h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Date prévue</p>
              <p className="text-gray-900">
                {new Date(selectedPost.scheduledDate).toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {selectedPost.videoTitle && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Vidéo source</p>
                <p className="text-gray-900">{selectedPost.videoTitle}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Contenu</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                {selectedPost.content?.slice(0, 300)}{selectedPost.content?.length > 300 ? '...' : ''}
              </p>
            </div>

            <div className="mb-6">
              <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                selectedPost.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                selectedPost.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedPost.status === 'SCHEDULED' ? 'Planifié' :
                 selectedPost.status === 'PUBLISHED' ? 'Publié' : 'Échoué'}
              </span>
            </div>

            {selectedPost.status === 'SCHEDULED' && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeletePost(selectedPost.id)}
                  disabled={deletingPostId === selectedPost.id}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingPostId === selectedPost.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
