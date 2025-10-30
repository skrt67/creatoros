'use client';

import Link from 'next/link';
import { ArrowRight, Video, FileText, Sparkles, CheckCircle, Zap, Rocket, TrendingUp, Play, Users, Globe } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Vidova</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Fonctionnalités
              </Link>
              <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Tarifs
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Connexion
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Modern Gradient */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-8">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Propulsé par l'IA</span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transformez vos vidéos
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              en contenu viral
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Créez du contenu multi-format avec l'IA. Blog, Twitter, LinkedIn, TikTok, Instagram en quelques secondes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              <Play className="h-5 w-5" />
              Voir comment ça marche
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">10k+</div>
              <div className="text-sm text-gray-600">Vidéos traitées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">5k+</div>
              <div className="text-sm text-gray-600">Créateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section id="features" className="px-6 lg:px-12 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Pourquoi choisir Vidova ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour dominer votre marché</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Augmentez vos revenus</h3>
              <p className="text-gray-700 leading-relaxed">
                Multipliez votre portée sur toutes les plateformes. Convertissez vos vidéos en contenu optimisé pour chaque réseau social.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 hover:border-purple-300 transition-all hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">IA ultra-puissante</h3>
              <p className="text-gray-700 leading-relaxed">
                Notre moteur IA de dernière génération comprend le contexte et génère du contenu authentique qui résonne avec votre audience.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200 hover:border-green-300 transition-all hover:shadow-xl transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform shadow-lg">
                <Rocket className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Gagnez du temps</h3>
              <p className="text-gray-700 leading-relaxed">
                Automatisez votre workflow de création. Ce qui prenait des heures ne prend maintenant que quelques minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section 1 */}
      <section className="px-6 lg:px-12 py-24 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                Transcription intelligente
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                De YouTube au monde entier
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Collez simplement votre URL YouTube. Notre IA analyse, transcrit et génère automatiquement du contenu optimisé pour chaque plateforme en quelques minutes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Transcription précise avec timestamps</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Génération multi-format (Blog, Twitter, LinkedIn...)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Optimisation SEO automatique</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl aspect-square flex items-center justify-center border border-indigo-200 shadow-2xl">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <Video className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section 2 */}
      <section className="px-6 lg:px-12 py-24 bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative lg:order-first">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl aspect-square flex items-center justify-center border border-purple-200 shadow-2xl">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <FileText className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                Automatisation complète
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Workflow optimisé pour les créateurs
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Concentrez-vous sur la création. Vidova s'occupe du reste : transcription, formatage, adaptation et publication sur vos plateformes préférées.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Traitement automatique 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Export en un clic vers toutes vos plateformes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Templates personnalisables pour votre marque</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 lg:px-12 py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-gray-600">Commencez gratuitement, évoluez à votre rythme</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuit</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">0€</span>
                <span className="text-gray-600">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>3 vidéos par mois</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Transcription automatique</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Export basique</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl border-2 border-indigo-600 shadow-2xl transform scale-105">
              <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold mb-4">
                LE PLUS POPULAIRE
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">29€</span>
                <span className="text-indigo-100">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>30 vidéos par mois</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>IA avancée</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Templates premium</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center px-6 py-3 bg-white hover:bg-gray-50 text-indigo-600 font-semibold rounded-xl transition-all shadow-xl"
              >
                Commencer l'essai
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Entreprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Sur mesure</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Vidéos illimitées</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>API privée</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Support dédié</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Formation équipe</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block text-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-24 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Prêt à transformer votre création de contenu ?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers de créateurs qui utilisent Vidova pour dominer leur marché.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 font-semibold rounded-xl transition-all shadow-xl transform hover:scale-105"
            >
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl transition-all border-2 border-white/30 hover:border-white/50"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
