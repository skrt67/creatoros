'use client';

import Link from 'next/link';
import { ArrowRight, Video, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Vidova
            </Link>
            <div className="flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Fonctionnalités
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 pt-24 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Le nouveau standard
              <span className="block">de création de contenu</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              Conçu pour convertir. Construit pour scaler.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section id="features" className="px-6 lg:px-12 py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Augmentez vos revenus</h3>
              <p className="text-gray-600 leading-relaxed">
                La plateforme Vidova est conçue pour aider les créateurs à grandir. Optimisée pour éliminer les frictions et générer instantanément plus de conversions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Création à l'épreuve du temps</h3>
              <p className="text-gray-600 leading-relaxed">
                Un moteur IA puissant traduit vos vidéos en contenu multiformat — permettant les workflows de création les plus détaillés du secteur.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Réduisez les coûts</h3>
              <p className="text-gray-600 leading-relaxed">
                Éliminez les vérifications manuelles, les emails sans fin et les révisions interminables — en automatisant les tâches répétitives et les workflows de création.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="px-6 lg:px-12 py-32">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transformez vos vidéos en contenu viral
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Notre IA analyse automatiquement vos vidéos YouTube et génère du contenu optimisé pour chaque plateforme. Articles de blog, posts LinkedIn, threads Twitter — tout est prêt en quelques minutes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Transcription intelligente avec timestamps</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Génération multi-format automatique</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Optimisation SEO intégrée</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
              <Video className="h-24 w-24 text-gray-400" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center lg:order-first">
              <FileText className="h-24 w-24 text-gray-400" />
            </div>
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Automatisez votre workflow de création
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gagnez des heures chaque semaine. Vidova automatise les tâches répétitives pour que vous puissiez vous concentrer sur la création et la stratégie.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Traitement vidéo 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Export en un clic vers vos plateformes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Templates personnalisables</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-32 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à transformer votre création de contenu ?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers de créateurs qui utilisent Vidova pour scaler leur contenu.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-lg transition-colors"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
