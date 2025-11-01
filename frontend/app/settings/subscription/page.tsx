'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { ArrowLeft, Crown, CreditCard, Calendar, Video, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
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
        console.log('Subscription data:', data);
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Erreur lors du chargement de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez l\'accès Pro jusqu\'à la fin de votre période de facturation.')) {
      return;
    }

    try {
      setCancellingSubscription(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

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
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de l\'annulation');
      }

      const data = await response.json();
      window.location.href = data.portal_url;

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Erreur lors de l\'accès au portail de gestion');
    } finally {
      setCancellingSubscription(false);
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
    ? new Date(subscription.stripe_current_period_end).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
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
              href="/settings"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-light">Retour aux paramètres</span>
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
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-medium text-gray-900">
                    {isPro ? 'Plan Pro' : 'Plan Gratuit'}
                  </h2>
                  {isPro && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-gray-900 text-gray-900 text-xs font-medium rounded-full">
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

            {/* Status & Renewal */}
            {isPro && (
              <>
                <div className="flex items-center gap-2 text-sm mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="font-medium">Abonnement actif</span>
                  </div>
                  {renewalDate && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Renouvellement le {renewalDate}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Cancel Button */}
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  className="w-full px-4 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium disabled:opacity-50"
                >
                  {cancellingSubscription ? 'Chargement...' : 'Annuler mon abonnement'}
                </button>
              </>
            )}

            {/* Upgrade for Free users */}
            {!isPro && (
              <Link
                href="/billing"
                className="block w-full px-4 py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4" />
                  Passer à Pro - 14,99€/mois
                </div>
              </Link>
            )}
          </div>

          {/* Payment Method */}
          {isPro && subscription?.stripe_customer_id && !subscription.stripe_customer_id.startsWith('cus_test_') && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Moyen de paiement</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Carte bancaire</p>
                    <p className="text-sm text-gray-600 font-light">Géré par Stripe</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 transition-colors font-medium text-sm"
                >
                  Modifier
                </button>
              </div>
            </div>
          )}

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
              <h3 className="font-medium text-gray-900 mb-3">Support</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Une question sur votre abonnement ? Notre équipe est là pour vous aider.
              </p>
              <a
                href="mailto:support@vidova.me"
                className="text-sm text-gray-900 hover:underline font-medium inline-flex items-center gap-1"
              >
                Contacter le support
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
