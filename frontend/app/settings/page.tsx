'use client';

import Link from 'next/link';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { ArrowLeft, User, Bell, Shield, Video, LogOut, CreditCard, Crown } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    Cookies.remove('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-900">Vidova</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-light">Retour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-12 tracking-tight">
            Paramètres
          </h1>

          {/* Tabs */}
          <div className="flex gap-8 mb-16 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'subscription', label: 'Abonnement', icon: Crown },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Sécurité', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-light text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Informations du profil</h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600"
                      placeholder="Votre email"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-light">Votre adresse email ne peut pas être modifiée</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Plan actuel</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-yellow-400" strokeWidth={1.5} />
                        <span className="text-lg font-bold">Plan Pro</span>
                      </div>
                      <p className="text-gray-300 font-light">Accès complet à toutes les fonctionnalités</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">14,99€</div>
                      <div className="text-sm text-gray-300">par mois</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-sm text-gray-300">Vidéos</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-sm text-gray-300">Contenu généré</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm text-gray-300">Support</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">Prochaine facturation</p>
                      <p className="font-medium">15 décembre 2024</p>
                    </div>
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                      Gérer l'abonnement
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Historique de facturation</h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Plan Pro - Décembre 2024</p>
                        <p className="text-sm text-gray-600 font-light">Facturé le 15 novembre 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">14,99€</p>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Télécharger
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Plan Pro - Novembre 2024</p>
                        <p className="text-sm text-gray-600 font-light">Facturé le 15 octobre 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">14,99€</p>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Télécharger
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Plan Pro - Octobre 2024</p>
                        <p className="text-sm text-gray-600 font-light">Facturé le 15 septembre 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">14,99€</p>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Méthode de paiement</h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-600 font-light">Expire le 12/26</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 transition-colors font-medium">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Préférences de notifications</h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 space-y-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-gray-300" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block mb-1">Notifications par email</span>
                      <p className="text-sm text-gray-600 font-light">Recevez des mises à jour par email</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-gray-300" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block mb-1">Vidéos traitées</span>
                      <p className="text-sm text-gray-600 font-light">Notification quand une vidéo est prête</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-gray-300" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block mb-1">Rapport hebdomadaire</span>
                      <p className="text-sm text-gray-600 font-light">Résumé hebdomadaire de vos activités</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Sécurité</h3>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 space-y-4">
                  <button className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 transition-colors text-sm font-medium">
                    Changer le mot de passe
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
