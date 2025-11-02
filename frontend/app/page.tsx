'use client';

import Link from 'next/link';
import { ArrowRight, Video, FileText, Sparkles, CheckCircle, Zap, Target, TrendingUp, Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.15),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Video className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Vidova</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
                Fonctionnalités
              </Link>
              <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
                Tarifs
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-4 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                Commencer →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12">
        {/* Content */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8 group hover:border-purple-500/50 transition-all">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" strokeWidth={2} />
            <span className="text-sm font-semibold text-gray-300">Propulsé par l'IA Avancée</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Transformez vos vidéos
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              en contenu viral
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            L'IA génère du contenu optimisé pour <span className="text-purple-400 font-bold">Twitter</span>, <span className="text-blue-400 font-bold">LinkedIn</span>, <span className="text-pink-400 font-bold">TikTok</span>, <span className="text-orange-400 font-bold">Instagram</span> en <span className="font-bold text-white">30 secondes</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 font-bold text-lg"
            >
              <Play className="h-5 w-5" fill="currentColor" />
              <span>Essayer gratuitement</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-white/20 text-white rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all backdrop-blur-sm font-bold text-lg"
            >
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Voir la démo</span>
            </Link>
          </div>

          {/* Video Preview Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-purple-400 ml-1" fill="currentColor" />
                  </div>
                  <p className="text-gray-400 font-medium">Démo interactive bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">10k+</div>
              <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Vidéos transformées</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">5k+</div>
              <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Créateurs actifs</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all group">
              <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full text-purple-400 text-sm font-bold border border-purple-500/20">
                ✨ Fonctionnalités
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Tout ce dont vous avez besoin
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Une suite complète d'outils IA pour maximiser l'impact de vos vidéos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-purple-400" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Transcription Instantanée</h3>
                <p className="text-gray-400 leading-relaxed">
                  Convertissez n'importe quelle vidéo en texte en <span className="text-purple-400 font-bold">quelques secondes</span> avec une précision de 99%
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-blue-400" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Multi-Plateforme</h3>
                <p className="text-gray-400 leading-relaxed">
                  Générez du contenu <span className="text-blue-400 font-bold">optimisé</span> pour Twitter, LinkedIn, TikTok, Instagram et plus
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 hover:border-green-500/50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-green-400" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Contenu Viral</h3>
                <p className="text-gray-400 leading-relaxed">
                  L'IA analyse les tendances pour créer du contenu <span className="text-green-400 font-bold">à fort engagement</span>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-400" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Articles de Blog SEO</h4>
                  <p className="text-gray-400 text-sm">Transformez vos vidéos en articles optimisés pour Google en un clic</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-blue-400" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Suggestions de Clips</h4>
                  <p className="text-gray-400 text-sm">L'IA identifie automatiquement les meilleurs moments viraux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 lg:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full text-blue-400 text-sm font-bold border border-blue-500/20">
                💎 Tarifs
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Des prix qui s'adaptent à vous
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Commencez gratuitement, passez au niveau supérieur quand vous voulez
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 hover:border-gray-500/50 transition-all">
                <h3 className="text-2xl font-bold text-white mb-2">Gratuit</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">0€</span>
                  <span className="text-gray-400 text-lg">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">3 vidéos par mois</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">Transcription IA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">Génération de contenu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">Support communautaire</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block w-full px-6 py-4 bg-white/10 backdrop-blur-sm text-white text-center rounded-xl hover:bg-white/20 transition-all font-bold border border-white/20"
                >
                  Commencer
                </Link>
              </div>
            </div>

            {/* Pro Plan - FEATURED */}
            <div className="group relative transform md:scale-110 z-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-3xl opacity-75 blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-purple-400/50 rounded-3xl p-8 shadow-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-black rounded-full uppercase tracking-wider shadow-lg">
                    ⭐ Populaire
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 mt-2">Pro</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">14,99€</span>
                  <span className="text-white/80 text-lg">/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" strokeWidth={2} fill="currentColor" />
                    <span className="text-white font-medium">Vidéos <span className="font-black">illimitées</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" strokeWidth={2} fill="currentColor" />
                    <span className="text-white font-medium">Priorité de traitement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" strokeWidth={2} fill="currentColor" />
                    <span className="text-white font-medium">Tous les formats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" strokeWidth={2} fill="currentColor" />
                    <span className="text-white font-medium">Support prioritaire</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block w-full px-6 py-4 bg-white text-purple-600 text-center rounded-xl hover:bg-gray-100 transition-all font-black shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  Commencer maintenant →
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all">
                <h3 className="text-2xl font-bold text-white mb-2">Entreprise</h3>
                <div className="mb-8">
                  <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Sur mesure</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">Volume personnalisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">API dédiée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">White-label</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-300">Support 24/7</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all font-bold"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <Sparkles className="h-16 w-16 text-purple-400 mx-auto animate-pulse" strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Prêt à dominer les réseaux sociaux ?
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Rejoignez <span className="text-purple-400 font-bold">5000+ créateurs</span> qui transforment leurs vidéos en contenu viral
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 font-bold text-lg"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-3 px-12 py-5 border-2 border-white/20 text-white rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all backdrop-blur-sm font-bold text-lg"
            >
              Voir les tarifs
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-gray-400 text-sm">✓ Sans carte bancaire</div>
            <div className="text-gray-400 text-sm">✓ Gratuit à vie</div>
            <div className="text-gray-400 text-sm">✓ Support français</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6 lg:px-12 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Video className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Vidova</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                L'IA qui transforme vos vidéos en contenu viral pour tous vos réseaux sociaux
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Produit</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#pricing" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Tarifs</Link></li>
                <li><Link href="/help" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Légal</h3>
              <ul className="space-y-3">
                <li><Link href="/legal/privacy" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Confidentialité</Link></li>
                <li><Link href="/legal/terms" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">CGU</Link></li>
                <li><Link href="/legal/mentions" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Mentions légales</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Contact</Link></li>
                <li><Link href="/help" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Centre d'aide</Link></li>
                <li><a href="mailto:support@vidova.me" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">support@vidova.me</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Vidova. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Propulsé par</span>
              <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">IA Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
