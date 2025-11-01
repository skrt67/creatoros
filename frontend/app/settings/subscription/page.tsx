'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { ArrowLeft, Crown, Check, ExternalLink, CreditCard, Calendar, Video } from 'lucide-react';
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

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/billing/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Erreur lors du chargement de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      const response = await fetch(`${apiUrl}/billing/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          return_url: `${window.location.origin}/settings/subscription`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session');
      }

      const data = await response.json();
      window.location.href = data.portal_url;

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Erreur lors de l\'accès au portail');
    } finally {
      setManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  const isPro = subscription?.plan === 'PRO';
  const renewalDate = subscription?.stripe_current_period_end
    ? new Date(subscription.stripe_current_period_end * 1000).toLocaleDateString('fr-FR')
    : null;

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
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Mon Abonnement
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Gérez votre plan et votre facturation
            </p>
          </div>

          {/* Current Plan Card */}
          <div className={`rounded-2xl border-2 p-8 mb-8 ${
            isPro
              ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-medium text-gray-900">
                    {isPro ? 'Plan Pro' : 'Plan Gratuit'}
                  </h2>
                  {isPro && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full">
                      <Crown className="h-3 w-3" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-gray-600 font-light">
                  {isPro ? 'Accès illimité à toutes les fonctionnalités' : 'Fonctionnalités de base'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-900">
                  {isPro ? '14,99€' : '0€'}
                </div>
                <div className="text-sm text-gray-500 font-light">
                  {isPro ? '/mois' : ''}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-gray-900" strokeWidth={2} />
                <span className="text-gray-700 font-light">
                  {isPro ? 'Vidéos illimitées' : '3 vidéos par mois'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-gray-900" strokeWidth={2} />
                <span className="text-gray-700 font-light">
                  Transcription IA {isPro ? 'avancée' : 'basique'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-gray-900" strokeWidth={2} />
                <span className="text-gray-700 font-light">
                  Génération de contenu {isPro ? 'complète' : 'standard'}
                </span>
              </div>
              {isPro && (
                <>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-gray-900" strokeWidth={2} />
                    <span className="text-gray-700 font-light">
                      Traitement prioritaire
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-gray-900" strokeWidth={2} />
                    <span className="text-gray-700 font-light">
                      Support prioritaire
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Status & Actions */}
            {isPro && renewalDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 font-light mb-6 pt-6 border-t border-gray-200">
                <Calendar className="h-4 w-4" />
                <span>Renouvellement le {renewalDate}</span>
              </div>
            )}

            <div className="flex gap-3">
              {isPro ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {managingSubscription ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Gérer mon abonnement
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href="/billing"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  Passer à Pro
                </Link>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200/60 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-3">Facturation sécurisée</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Tous les paiements sont traités de manière sécurisée via Stripe. Nous ne stockons jamais vos informations bancaires.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sécurisé par Stripe</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-3">Annulation facile</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Vous pouvez annuler votre abonnement à tout moment. L'accès Pro reste actif jusqu'à la fin de votre période de facturation.
              </p>
              <a
                href="mailto:support@vidova.me"
                className="text-xs text-gray-900 hover:underline font-medium"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
