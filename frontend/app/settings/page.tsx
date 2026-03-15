'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  ArrowLeft, User, Crown, CreditCard, Calendar, Bell, Shield,
  Video, LogOut, Palette, Save, ExternalLink, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SubscriptionData {
  id: string | null;
  user_id: string;
  plan: 'FREE' | 'PRO';
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: number | null;
}

interface ContentPreferences {
  writing_style: string;
  content_length: string;
  tone: string;
}

const sections = [
  { id: 'profile', label: 'Profil', icon: User, description: 'Informations personnelles' },
  { id: 'subscription', label: 'Abonnement', icon: Crown, description: 'Plan et facturation' },
  { id: 'content', label: 'Contenu IA', icon: Palette, description: 'Style de génération' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alertes et emails' },
  { id: 'security', label: 'Sécurité', icon: Shield, description: 'Mot de passe et connexion' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  // Subscription state
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);

  // Content preferences state
  const [preferences, setPreferences] = useState<ContentPreferences>({
    writing_style: 'BALANCED',
    content_length: 'MEDIUM',
    tone: 'FRIENDLY'
  });
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    email_updates: true,
    video_ready: true,
    weekly_report: false,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchSubscription();
    fetchPreferences();
    fetchUserEmail();
    // Load notification preferences from localStorage
    const saved = localStorage.getItem('vidova_notifications');
    if (saved) {
      try { setNotifications(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Handle URL hash for direct section links
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.find(s => s.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  const fetchUserEmail = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email || '');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`${apiUrl}/billing/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSub(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${apiUrl}/preferences/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences({
          writing_style: data.writing_style,
          content_length: data.content_length,
          tone: data.tone
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoadingPrefs(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible.')) return;
    try {
      setCancellingSubscription(true);
      const response = await fetch(`${apiUrl}/billing/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de l\'annulation');
      }
      toast.success('Abonnement annulé avec succès');
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'annulation');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setCancellingSubscription(true);
      const response = await fetch(`${apiUrl}/billing/create-portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ return_url: `${window.location.origin}/settings#subscription` })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur');
      }
      const data = await response.json();
      window.location.href = data.portal_url;
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'accès au portail');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      const response = await fetch(`${apiUrl}/preferences/content`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (response.ok) {
        toast.success('Préférences sauvegardées');
      } else {
        throw new Error('Erreur');
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      setChangingPassword(true);
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors du changement de mot de passe');
      }
      toast.success('Mot de passe modifié avec succès');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('vidova_notifications', JSON.stringify(updated));
    toast.success('Préférence sauvegardée');
  };

  const isPro = subscription?.plan === 'PRO';
  const renewalDate = subscription?.stripe_current_period_end
    ? new Date(subscription.stripe_current_period_end).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-900">Vidova</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span>Retour au tableau de bord</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="pt-16 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 py-10">

          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Paramètres</h1>
              <nav className="space-y-1">
                {sections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        window.history.replaceState(null, '', `#${section.id}`);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 flex-shrink-0" strokeWidth={1.5} />
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{section.label}</div>
                        <div className={`text-xs truncate ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{section.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Logout at bottom of sidebar */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5" strokeWidth={1.5} />
                  <span className="text-sm font-medium">Se déconnecter</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">

              {/* === PROFIL === */}
              {activeSection === 'profile' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
                    <p className="text-sm text-gray-500 mt-1">Vos informations personnelles</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                      <input
                        type="email"
                        disabled
                        value={userEmail}
                        className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-2">Votre adresse email ne peut pas être modifiée</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan actuel</label>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isPro ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isPro && <Crown className="h-3 w-3" />}
                          {isPro ? 'Pro' : 'Gratuit'}
                        </span>
                        {!isPro && (
                          <button
                            onClick={() => setActiveSection('subscription')}
                            className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2"
                          >
                            Passer à Pro
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === ABONNEMENT === */}
              {activeSection === 'subscription' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Abonnement</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez votre plan et votre facturation</p>
                  </div>

                  {loadingSub ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Current Plan */}
                      <div className="flex items-start justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {isPro ? 'Plan Pro' : 'Plan Gratuit'}
                            </h3>
                            {isPro && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                                <Crown className="h-3 w-3" />
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {isPro ? 'Accès illimité à toutes les fonctionnalités' : 'Fonctionnalités de base'}
                          </p>
                          {isPro && (
                            <div className="flex items-center gap-4 mt-3 text-xs">
                              <span className="flex items-center gap-1.5 text-green-600">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                Actif
                              </span>
                              {renewalDate && (
                                <span className="flex items-center gap-1.5 text-gray-400">
                                  <Calendar className="h-3 w-3" />
                                  Renouvellement le {renewalDate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold text-gray-900">{isPro ? '14,99€' : '0€'}</div>
                          {isPro && <div className="text-xs text-gray-400">/mois</div>}
                        </div>
                      </div>

                      {/* Payment Method (real Stripe only) */}
                      {isPro && subscription?.stripe_customer_id && !subscription.stripe_customer_id.startsWith('cus_test_') && (
                        <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center">
                              <CreditCard className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Carte bancaire</p>
                              <p className="text-xs text-gray-400">Géré par Stripe</p>
                            </div>
                          </div>
                          <button
                            onClick={handleManageSubscription}
                            disabled={cancellingSubscription}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
                          >
                            Modifier
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      {isPro ? (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={cancellingSubscription}
                          className="w-full px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {cancellingSubscription ? 'Chargement...' : 'Annuler mon abonnement'}
                        </button>
                      ) : (
                        <Link
                          href="/billing"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                          <Crown className="h-4 w-4" />
                          Passer à Pro - 14,99€/mois
                        </Link>
                      )}

                      {/* Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-1">Paiement sécurisé</p>
                          <p className="text-xs text-gray-400">Traité par Stripe. Nous ne stockons aucune donnée bancaire.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-1">Besoin d'aide ?</p>
                          <a href="mailto:support@vidova.me" className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
                            support@vidova.me <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === CONTENU IA === */}
              {activeSection === 'content' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Préférences de contenu</h2>
                    <p className="text-sm text-gray-500 mt-1">Personnalisez le style des contenus générés par l'IA</p>
                  </div>

                  {loadingPrefs ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Writing Style */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Style d'écriture</h3>
                        <p className="text-xs text-gray-400 mb-3">Choisissez le style pour vos contenus générés</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { value: 'FORMAL', label: 'Formel', desc: 'Structuré' },
                            { value: 'CASUAL', label: 'Décontracté', desc: 'Accessible' },
                            { value: 'BALANCED', label: 'Équilibré', desc: 'Polyvalent' },
                            { value: 'PROFESSIONAL', label: 'Professionnel', desc: 'Business' },
                            { value: 'CREATIVE', label: 'Créatif', desc: 'Original' },
                          ].map(style => (
                            <button
                              key={style.value}
                              onClick={() => setPreferences({ ...preferences, writing_style: style.value })}
                              className={`p-3 border rounded-xl text-left transition-all ${
                                preferences.writing_style === style.value
                                  ? 'border-gray-900 bg-gray-900 text-white'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="text-sm font-medium">{style.label}</div>
                              <div className={`text-xs ${preferences.writing_style === style.value ? 'text-gray-300' : 'text-gray-400'}`}>{style.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Content Length */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Longueur du contenu</h3>
                        <p className="text-xs text-gray-400 mb-3">Définissez la longueur préférée</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'SHORT', label: 'Court', desc: '300-500 mots' },
                            { value: 'MEDIUM', label: 'Moyen', desc: '700-1000 mots' },
                            { value: 'LONG', label: 'Long', desc: '1200+ mots' },
                          ].map(length => (
                            <button
                              key={length.value}
                              onClick={() => setPreferences({ ...preferences, content_length: length.value })}
                              className={`p-3 border rounded-xl text-left transition-all ${
                                preferences.content_length === length.value
                                  ? 'border-gray-900 bg-gray-900 text-white'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="text-sm font-medium">{length.label}</div>
                              <div className={`text-xs ${preferences.content_length === length.value ? 'text-gray-300' : 'text-gray-400'}`}>{length.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tone */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Ton général</h3>
                        <p className="text-xs text-gray-400 mb-3">Sélectionnez le ton de vos contenus</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { value: 'FRIENDLY', label: 'Amical', desc: 'Chaleureux' },
                            { value: 'PROFESSIONAL', label: 'Professionnel', desc: 'Expert' },
                            { value: 'INSPIRATIONAL', label: 'Inspirant', desc: 'Motivant' },
                            { value: 'HUMOROUS', label: 'Humoristique', desc: 'Amusant' },
                            { value: 'SERIOUS', label: 'Sérieux', desc: 'Factuel' },
                          ].map(tone => (
                            <button
                              key={tone.value}
                              onClick={() => setPreferences({ ...preferences, tone: tone.value })}
                              className={`p-3 border rounded-xl text-left transition-all ${
                                preferences.tone === tone.value
                                  ? 'border-gray-900 bg-gray-900 text-white'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="text-sm font-medium">{tone.label}</div>
                              <div className={`text-xs ${preferences.tone === tone.value ? 'text-gray-300' : 'text-gray-400'}`}>{tone.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Save */}
                      <div className="pt-2">
                        <button
                          onClick={savePreferences}
                          disabled={savingPrefs}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {savingPrefs ? (
                            <>
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Sauvegarder les préférences
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === NOTIFICATIONS === */}
              {activeSection === 'notifications' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos préférences de notifications</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'email_updates' as const, label: 'Notifications par email', desc: 'Recevez des mises à jour par email' },
                      { key: 'video_ready' as const, label: 'Vidéos traitées', desc: 'Notification quand une vidéo est prête' },
                      { key: 'weekly_report' as const, label: 'Rapport hebdomadaire', desc: 'Résumé hebdomadaire de vos activités' },
                    ].map((notif) => (
                      <button
                        key={notif.key}
                        onClick={() => toggleNotification(notif.key)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">{notif.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{notif.desc}</div>
                        </div>
                        <div className="relative flex-shrink-0 ml-4">
                          <div className={`w-10 h-6 rounded-full transition-colors ${notifications[notif.key] ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[notif.key] ? 'left-[18px]' : 'left-0.5'}`}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* === SECURITE === */}
              {activeSection === 'security' && (
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                    <p className="text-sm text-gray-500 mt-1">Gérez la sécurité de votre compte</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl border border-gray-200">
                      {!showPasswordForm ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Mot de passe</h3>
                            <p className="text-xs text-gray-400 mt-1">Modifiez votre mot de passe pour sécuriser votre compte</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                          >
                            Modifier
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-900">Changer le mot de passe</h3>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Mot de passe actuel</label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full max-w-sm px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                              placeholder="Votre mot de passe actuel"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Nouveau mot de passe</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full max-w-sm px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                              placeholder="Minimum 6 caractères"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Confirmer le nouveau mot de passe</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full max-w-sm px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                              placeholder="Confirmez votre nouveau mot de passe"
                            />
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={handleChangePassword}
                              disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                              {changingPassword ? 'Modification...' : 'Enregistrer'}
                            </button>
                            <button
                              onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Sessions actives</h3>
                          <p className="text-xs text-gray-400 mt-1">Vous êtes actuellement connecté sur cet appareil</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-green-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Connecté
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
