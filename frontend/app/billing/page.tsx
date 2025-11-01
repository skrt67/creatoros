'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Check, Crown, Video } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeToPro = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      const response = await fetch(`${apiUrl}/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          price_id: 'price_1SOfVwGUC8VxEGVNjalEbEiN',
          success_url: `${window.location.origin}/dashboard?upgrade=success`,
          cancel_url: `${window.location.origin}/billing?upgrade=cancelled`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création de la session de paiement');
      }

      const data = await response.json();
      window.location.href = data.session_url;

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      description: 'Parfait pour commencer',
      features: [
        '3 vidéos par mois',
        'Transcription basique',
        'Génération de contenu standard',
        'Support par email'
      ],
      cta: 'Plan actuel',
      current: true,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 14.99 : 149.99,
      description: 'Pour les créateurs sérieux',
      features: [
        'Vidéos illimitées',
        'Transcription IA avancée',
        'Tous les formats de contenu',
        'Traitement prioritaire',
        'Templates personnalisés',
        'Accès communauté Discord',
        'Support prioritaire'
      ],
      cta: 'Passer à Pro',
      current: false,
      popular: true
    }
  ];

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
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Tarifs
            </h1>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Commencez gratuitement, évoluez quand vous êtes prêt
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 p-1.5 bg-gray-100 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-md font-medium transition-all text-sm ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2.5 rounded-md font-medium transition-all text-sm ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
                <span className="ml-2 text-xs text-green-600 font-semibold">Économisez 17%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 transition-all ${
                  plan.popular
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                      <Crown className="h-3 w-3" />
                      <span>Recommandé</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-medium text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm font-light mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-light text-gray-900">{plan.price}€</span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 font-light">/{billingCycle === 'monthly' ? 'mois' : 'an'}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-4 w-4 text-gray-900" strokeWidth={2} />
                        </div>
                        <span className="text-gray-700 font-light text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => plan.id === 'pro' && handleUpgradeToPro()}
                    disabled={plan.current || isLoading}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-all text-sm ${
                      plan.current
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {plan.current ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        {plan.cta}
                      </span>
                    ) : isLoading && plan.id === 'pro' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Chargement...
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8 text-center tracking-tight">
              Questions fréquentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Puis-je changer de plan à tout moment ?',
                  a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont proratisés.'
                },
                {
                  q: "Que se passe-t-il si j'annule ?",
                  a: "Vous conserverez l'accès aux fonctionnalités payantes jusqu'à la fin de votre période de facturation, puis vous serez automatiquement basculé sur le plan gratuit."
                },
                {
                  q: 'Proposez-vous des remboursements ?',
                  a: 'Nous offrons une garantie satisfait ou remboursé de 30 jours pour tous les plans payants.'
                },
                {
                  q: 'Comment sont gérés les paiements ?',
                  a: 'Tous les paiements sont traités de manière sécurisée via Stripe. Nous ne stockons jamais vos informations de carte bancaire.'
                }
              ].map((faq, index) => (
                <details key={index} className="group bg-white border border-gray-200/60 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-sm">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 font-light text-sm border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-12 bg-gray-50 border border-gray-200/60 rounded-2xl">
              <h3 className="text-2xl font-light text-gray-900">
                Une question sur les plans ?
              </h3>
              <p className="text-gray-600 font-light">
                Notre équipe est là pour vous aider
              </p>
              <Link
                href="mailto:support@vidova.me"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
