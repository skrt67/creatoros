'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Video, Settings, FileText, Search, BookOpen, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function HelpPage() {
  const router = useRouter();
  const quickStartSteps = [
    {
      number: '1',
      title: 'Créez votre compte',
      description: 'Inscrivez-vous gratuitement en quelques secondes. Aucune carte bancaire requise.'
    },
    {
      number: '2',
      title: 'Ajoutez une vidéo YouTube',
      description: 'Collez simplement l\'URL de votre vidéo YouTube dans le dashboard.'
    },
    {
      number: '3',
      title: 'Laissez l\'IA travailler',
      description: 'Notre IA analyse la vidéo, crée la transcription et génère du contenu.'
    },
    {
      number: '4',
      title: 'Téléchargez et partagez',
      description: 'Récupérez vos articles, posts sociaux et newsletters prêts à publier.'
    }
  ];

  const features = [
    {
      icon: Video,
      title: 'Traitement de vidéos',
      description: 'Soumettez des URLs YouTube et obtenez des transcriptions complètes avec timestamps.',
      tips: ['Vidéos de 5 min à 2h', 'Support multi-langues', 'Détection automatique du locuteur']
    },
    {
      icon: FileText,
      title: 'Génération de contenu',
      description: 'Transformez automatiquement vos vidéos en plusieurs formats de contenu.',
      tips: ['Articles de blog SEO', 'Posts LinkedIn/Twitter', 'Newsletters', 'Highlights vidéo']
    },
    {
      icon: Settings,
      title: 'Workspaces',
      description: 'Organisez vos projets avec des espaces de travail dédiés.',
      tips: ['Workspaces illimités', 'Collaboration d\'équipe', 'Gestion des permissions']
    }
  ];

  const faqs = [
    {
      q: 'Comment fonctionne la transcription ?',
      a: 'Notre IA analyse l\'audio de votre vidéo YouTube, détecte les différents locuteurs et crée une transcription précise avec timestamps. Le tout en quelques minutes.'
    },
    {
      q: 'Quels types de contenu puis-je générer ?',
      a: 'Vous pouvez générer des articles de blog, posts LinkedIn, threads Twitter, newsletters, résumés vidéo et bien plus. Tous optimisés pour votre audience.'
    },
    {
      q: 'Combien de vidéos puis-je traiter ?',
      a: 'Le plan gratuit inclut 3 vidéos par mois. Les plans payants offrent un nombre illimité de vidéos avec traitement prioritaire.'
    },
    {
      q: 'Puis-je modifier le contenu généré ?',
      a: 'Absolument ! Vous pouvez éditer, copier et personnaliser tout le contenu généré directement depuis le dashboard.'
    },
    {
      q: 'Les données sont-elles sécurisées ?',
      a: 'Oui, toutes vos données sont chiffrées de bout en bout. Nous ne partageons jamais vos informations avec des tiers.'
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
                Vidova
              </span>
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Centre d'aide</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Comment pouvons-nous<br />vous aider ?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Trouvez des réponses, apprenez les bases et contactez notre support
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Guide de démarrage rapide
            </h2>
            <p className="text-lg text-gray-600">
              Commencez à créer du contenu en 4 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-all shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
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
            <p className="text-lg text-gray-600">
              Réponses aux questions les plus courantes
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
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

      {/* Contact */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Besoin d'aide supplémentaire ?</h2>
              <p className="text-white/90 text-lg mb-8">
                Notre équipe est là pour vous aider 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@creatoros.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  <Mail className="h-5 w-5" />
                  <span>Envoyer un email</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat en direct</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
