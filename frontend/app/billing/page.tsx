'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Zap, Check, Sparkles, Crown, Star } from 'lucide-react';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
      price: billingCycle === 'monthly' ? 29 : 290,
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
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 99 : 990,
      description: 'Pour les équipes et agences',
      features: [
        'Tout du plan Pro',
        'Collaboration en équipe',
        'Accès API',
        'Intégrations personnalisées',
        'Support dédié',
        'SLA garanti',
        'Branding personnalisé'
      ],
      cta: 'Contacter les ventes',
      current: false,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                CreatorOS
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 border border-primary-200 rounded-full text-primary-700 text-sm font-semibold mb-6">
            <Crown className="h-4 w-4" />
            <span>Plans & Tarification</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Choisissez le plan parfait<br />pour votre création
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Commencez gratuitement, évoluez quand vous êtes prêt
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-xl ${
                  plan.popular
                    ? 'border-primary-500 scale-105'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg">
                      <Star className="h-3 w-3" />
                      <span>Plus populaire</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-black text-gray-900">{plan.price}€</span>
                      {plan.price > 0 && (
                        <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mois' : 'an'}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    disabled={plan.current}
                    className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${
                      plan.current
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {plan.current ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" />
                        {plan.cta}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        {plan.cta}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>

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
                a: 'Nous offrons une garantie satisfait ou remboursé de 30 jours pour tous les plans payants. Contactez le support pour toute demande.'
              },
              {
                q: 'Comment sont gérés les paiements ?',
                a: 'Tous les paiements sont traités de manière sécurisée via Stripe. Nous ne stockons jamais vos informations de carte bancaire.'
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="font-bold text-gray-900">{faq.q}</span>
                  <span className="text-primary-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Une question sur les plans ?</h2>
              <p className="text-white/90 text-lg mb-8">
                Notre équipe est là pour vous aider à choisir le meilleur plan
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
