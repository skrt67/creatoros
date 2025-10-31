'use client';

import Link from 'next/link';
import { ArrowRight, Video, FileText, Sparkles, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight text-gray-900">Vidova</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                Fonctionnalités
              </Link>
              <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                Tarifs
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 lg:px-12 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(31,41,55,0.03),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(31,41,55,0.02),transparent_50%)]"></div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-8">
            <Sparkles className="h-4 w-4 text-gray-900" strokeWidth={1.5} />
            <span className="text-sm font-light text-gray-700">Propulsé par l'IA</span>
          </div>

          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
            Transformez vos vidéos<br />en contenu viral
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Créez du contenu multi-format avec l'IA. Blog, Twitter, LinkedIn, TikTok, Instagram en quelques secondes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              <span className="text-base font-medium">Commencer gratuitement</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-3 px-8 py-4 border border-gray-300 text-gray-900 rounded-xl hover:border-gray-400 transition-colors"
            >
              <span className="text-base font-medium">En savoir plus</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">10k+</div>
              <div className="text-sm text-gray-600 font-light">Vidéos créées</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">5k+</div>
              <div className="text-sm text-gray-600 font-light">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-2">98%</div>
              <div className="text-sm text-gray-600 font-light">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-px bg-gray-200/60"></div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Une plateforme complète pour transformer vos vidéos en contenu engageant
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <Video className="h-8 w-8 text-gray-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Transcription automatique</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Transformez vos vidéos YouTube en texte avec une précision maximale grâce à l'IA
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <Sparkles className="h-8 w-8 text-gray-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Génération de contenu</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Créez automatiquement des posts pour tous vos réseaux sociaux en quelques secondes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <FileText className="h-8 w-8 text-gray-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Articles de blog</h3>
              <p className="text-base text-gray-600 font-light leading-relaxed">
                Transformez vos vidéos en articles de blog optimisés pour le SEO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-px bg-gray-200/60"></div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Gratuit</h3>
              <div className="mb-6">
                <span className="text-4xl font-light text-gray-900">0€</span>
                <span className="text-gray-600 font-light">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">3 vidéos par mois</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">Transcription automatique</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">Génération de contenu IA</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-900 text-center rounded-lg hover:border-gray-400 transition-colors font-medium"
              >
                Commencer
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-900 border border-gray-900 rounded-2xl p-8 transform scale-105 shadow-xl">
              <div className="text-xs text-white/80 font-medium mb-4 uppercase tracking-wider">Populaire</div>
              <h3 className="text-2xl font-medium text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-light text-white">29€</span>
                <span className="text-white/80 font-light">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-white/90 font-light">Vidéos illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-white/90 font-light">Priorité de traitement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-white/90 font-light">Support prioritaire</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-white text-gray-900 text-center rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Commencer
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Entreprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-light text-gray-900">Sur mesure</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">Volume personnalisé</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">API dédiée</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-gray-600 font-light">Support 24/7</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-900 text-center rounded-lg hover:border-gray-400 transition-colors font-medium"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Prêt à transformer vos vidéos ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 font-light">
            Rejoignez des milliers de créateurs qui utilisent déjà Vidova
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
          >
            <span className="text-base font-medium">Commencer gratuitement</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-medium tracking-tight text-gray-900">Vidova</span>
              </div>
              <p className="text-sm text-gray-600 font-light">
                Transformez vos vidéos en contenu viral avec l'IA
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Produit</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 font-light">Fonctionnalités</Link></li>
                <li><Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 font-light">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Légal</h3>
              <ul className="space-y-3">
                <li><Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-gray-900 font-light">Confidentialité</Link></li>
                <li><Link href="/legal/terms" className="text-sm text-gray-600 hover:text-gray-900 font-light">Conditions</Link></li>
                <li><Link href="/legal/mentions" className="text-sm text-gray-600 hover:text-gray-900 font-light">Mentions légales</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 font-light">Nous contacter</Link></li>
                <li><Link href="/help" className="text-sm text-gray-600 hover:text-gray-900 font-light">Aide</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center font-light">
              © 2024 Vidova. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
