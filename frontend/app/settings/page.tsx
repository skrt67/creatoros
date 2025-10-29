'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, Zap, User, Bell, Shield, CreditCard, Palette, 
  Globe, Save, CheckCircle, Key, FileText, Eye, EyeOff,
  Moon, Sun, Monitor
} from 'lucide-react';
import { translations, type Language } from '@/utils/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect to dashboard for now - Settings page will be built later
  useEffect(() => {
    // Settings page is under construction
  }, []);
  const [saved, setSaved] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showYoutubeKey, setShowYoutubeKey] = useState(false);
  const [contentTone, setContentTone] = useState('professional');
  const [contentLength, setContentLength] = useState('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  // User data
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [videoNotifs, setVideoNotifs] = useState(true);
  const [weeklyNotifs, setWeeklyNotifs] = useState(true);
  const [featureNotifs, setFeatureNotifs] = useState(true);
  
  // Security
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  // Fonction de traduction - se recalcule automatiquement
  const t = (key: keyof typeof translations.fr) => translations[language][key];

  // Recalculer les tabs quand la langue change
  const tabs = useMemo(() => {
    const translate = (key: keyof typeof translations.fr) => translations[language][key];
    return [
      { id: 'profile', label: translate('profile'), icon: User },
      { id: 'notifications', label: translate('notifications'), icon: Bell },
      { id: 'security', label: translate('security'), icon: Shield },
      { id: 'billing', label: translate('billing'), icon: CreditCard },
      { id: 'apikeys', label: translate('apiKeys'), icon: Key },
      { id: 'content', label: translate('contentSettings'), icon: FileText },
      { id: 'preferences', label: translate('preferences'), icon: Palette },
    ];
  }, [language]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email || '');
          setUserName(data.name || data.email?.split('@')[0] || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const saved = localStorage.getItem('userSettings');
    if (saved) {
      const s = JSON.parse(saved);
      setGeminiApiKey(s.geminiApiKey || '');
      setYoutubeApiKey(s.youtubeApiKey || '');
      setContentTone(s.contentTone || 'professional');
      setContentLength(s.contentLength || 'medium');
      setIncludeEmojis(s.includeEmojis !== false);
      setAutoPublish(s.autoPublish || false);
      setTimezone(s.timezone || 'Europe/Paris');
      setDateFormat(s.dateFormat || 'DD/MM/YYYY');
      setEmailNotifs(s.emailNotifs !== false);
      setVideoNotifs(s.videoNotifs !== false);
      setWeeklyNotifs(s.weeklyNotifs !== false);
      setFeatureNotifs(s.featureNotifs !== false);
    }
  }, []);

  const handleSave = () => {
    // La langue est sauvegardée automatiquement par le contexte global
    // On sauvegarde seulement les autres préférences
    const savedSettings = localStorage.getItem('userSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    localStorage.setItem('userSettings', JSON.stringify({
      ...settings,
      geminiApiKey, youtubeApiKey,
      contentTone, contentLength, includeEmojis, autoPublish, timezone, dateFormat,
      emailNotifs, videoNotifs, weeklyNotifs, featureNotifs
    }));
    setSaved(true);
    toast.success(t('saved'));
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError(t('passwordMismatch'));
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError(t('passwordTooShort'));
      return;
    }
    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ current_password: passwordData.current, new_password: passwordData.new })
      });
      if (response.ok) {
        toast.success('Mot de passe modifié ! 🔒');
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        setPasswordError('Mot de passe actuel incorrect');
        toast.error('Échec');
      }
    } catch (error) {
      setPasswordError(t('connectionError'));
    }
  };

  return (
    <div key={language} className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">Vidova</span>
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('manageAccount')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profileInfo')}</h2>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Chargement...</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('name')}</label>
                          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('email')}</label>
                          <input type="email" value={userEmail} disabled className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                        </div>
                      </div>
                      <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                        <Save className="h-5 w-5" />
                        {t('saveChanges')}
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'apikeys' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('apiKeysTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('apiKeysDescription')}</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('geminiApiKey')}</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('geminiApiKeyDesc')}</p>
                      <div className="relative">
                        <input type={showGeminiKey ? 'text' : 'password'} value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} placeholder={t('apiKeyPlaceholder')} className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" />
                        <button type="button" onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {showGeminiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('youtubeApiKey')}</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('youtubeApiKeyDesc')}</p>
                      <div className="relative">
                        <input type={showYoutubeKey ? 'text' : 'password'} value={youtubeApiKey} onChange={(e) => setYoutubeApiKey(e.target.value)} placeholder={t('apiKeyPlaceholder')} className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" />
                        <button type="button" onClick={() => setShowYoutubeKey(!showYoutubeKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {showYoutubeKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                    <Save className="h-5 w-5" />
                    {t('save')}
                  </button>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('contentSettingsTitle')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('contentSettingsDesc')}</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('defaultTone')}</label>
                      <select value={contentTone} onChange={(e) => setContentTone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl">
                        <option value="professional">{translations[language].toneOptions.professional}</option>
                        <option value="casual">{translations[language].toneOptions.casual}</option>
                        <option value="enthusiastic">{translations[language].toneOptions.enthusiastic}</option>
                        <option value="educational">{translations[language].toneOptions.educational}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('contentLength')}</label>
                      <div className="flex gap-3">
                        {(['short', 'medium', 'long'] as const).map((length) => (
                          <button key={length} onClick={() => setContentLength(length)} className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${contentLength === length ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                            {translations[language].lengthOptions[length]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <input type="checkbox" checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} className="mt-1 rounded" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('includeEmojis')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('includeEmojisDesc')}</p>
                      </div>
                    </label>
                  </div>
                  <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                    <Save className="h-5 w-5" />
                    {t('save')}
                  </button>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('preferences')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('customizeExperience')}</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Globe className="h-4 w-4" />
                        {t('language')}
                      </label>
                      <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('dateFormat')}</label>
                      <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('timezone')}</label>
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl">
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                    <Save className="h-5 w-5" />
                    {t('save')}
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('notificationPreferences')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('notificationDescription')}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                      <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('emailNotifications')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                      <input type="checkbox" checked={videoNotifs} onChange={(e) => setVideoNotifs(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('videoProcessed')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('videoProcessedDesc')}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                      <input type="checkbox" checked={weeklyNotifs} onChange={(e) => setWeeklyNotifs(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('weeklyDigest')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('weeklyDigestDesc')}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                      <input type="checkbox" checked={featureNotifs} onChange={(e) => setFeatureNotifs(e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('newFeatures')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('newFeaturesDesc')}</p>
                      </div>
                    </label>
                  </div>
                  <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                    <Save className="h-5 w-5" />
                    {t('save')}
                  </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('accountSecurity')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('securityDescription')}</p>
                  </div>
                  {passwordError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm text-red-700 dark:text-red-400">{passwordError}</p>
                    </div>
                  )}
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('currentPassword')}</label>
                      <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('newPassword')}</label>
                      <input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" minLength={6} required />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('minChars')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('confirmPassword')}</label>
                      <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl" required />
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl">
                      <Shield className="h-5 w-5" />
                      {t('updatePassword')}
                    </button>
                  </form>
                  <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">{t('dangerZone')}</h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">{t('deleteAccountWarning')}</p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all">
                      {t('deleteMyAccount')}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('billingAndSubscription')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('billingDescription')}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">{t('currentPlan')}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{t('free')}</p>
                      </div>
                      <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400">3 {t('videosPerMonth')}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Link href="/billing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">
                        <CreditCard className="h-5 w-5" />
                        <span>{t('viewAllPlans')}</span>
                      </Link>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t('upgradeToUnlock')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('billingHistory')}</h3>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('date')}</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('description')}</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('amount')}</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('status')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                              {t('noTransactions')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </main>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl shadow-2xl">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">{t('saved')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
