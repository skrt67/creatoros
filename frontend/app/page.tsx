'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Video, FileText, Share2, Clock, Shield, Sparkles, TrendingUp, Users, Globe, CheckCircle, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
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

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Connexion
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 border border-primary-200 rounded-full text-primary-700 text-sm font-semibold mb-6 animate-bounce-subtle">
              <Sparkles className="h-4 w-4" />
              <span>Plateforme IA N°1 pour créateurs de contenu</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Créez du contenu viral<br />
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                en quelques secondes
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformez vos vidéos YouTube en articles de blog, posts sociaux, newsletters et bien plus. 
              <span className="font-bold text-primary-600"> L'IA fait tout le travail.</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700"><strong className="text-gray-900 text-lg">10,000+</strong> Créateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700"><strong className="text-gray-900 text-lg">50,000+</strong> Vidéos</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700"><strong className="text-gray-900 text-lg">120+</strong> Pays</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-lg"
              >
                <Sparkles className="h-5 w-5" />
                <span>Commencer gratuitement</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all text-lg"
              >
                <span>Voir comment ça marche</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 border-2 border-white"></div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-700">4.9/5</span>
                <span>par 2,500+ utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              <span>Fonctionnalités puissantes</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour automatiser votre création de contenu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                color: 'from-blue-500 to-blue-600',
                title: 'Traitement Intelligent',
                description: 'Transcription IA avec détection du locuteur et analyse de sentiment automatique.'
              },
              {
                icon: FileText,
                color: 'from-green-500 to-emerald-600',
                title: 'Multi-formats',
                description: 'Créez des articles, threads Twitter, posts LinkedIn, newsletters instantanément.'
              },
              {
                icon: Share2,
                color: 'from-orange-500 to-amber-600',
                title: 'Partage Rapide',
                description: 'Copiez et partagez votre contenu sur toutes vos plateformes en un clic.'
              },
              {
                icon: Clock,
                color: 'from-red-500 to-pink-500',
                title: 'Gain de Temps',
                description: 'Transformez des heures de travail en quelques minutes d\'automatisation.'
              },
              {
                icon: Shield,
                color: 'from-purple-500 to-purple-600',
                title: 'Sécurité Enterprise',
                description: 'Chiffrement de bout en bout et protection de vos données garantie.'
              },
              {
                icon: Sparkles,
                color: 'from-indigo-500 to-indigo-600',
                title: 'IA Avancée',
                description: 'Suggestions intelligentes et identification des moments clés automatique.'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary-50 via-purple-50/50 to-pink-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Simple et rapide
            </h2>
            <p className="text-xl text-gray-600">
              Transformez vos vidéos en 3 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Ajoutez votre vidéo',
                description: 'Collez simplement l\'URL de votre vidéo YouTube. Notre IA commence le traitement instantanément.'
              },
              {
                step: '2',
                title: 'L\'IA analyse',
                description: 'Transcription, analyse des sentiments, identification des moments clés - tout automatiquement.'
              },
              {
                step: '3',
                title: 'Récupérez le contenu',
                description: 'Obtenez articles, posts sociaux, newsletters prêts à publier sur toutes vos plateformes.'
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mb-6 group-hover:scale-110 group-hover:shadow-2xl transition-all">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Prêt à transformer votre création de contenu ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers de créateurs qui utilisent CreatorOS pour scaler leur contenu.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-lg"
          >
            <Sparkles className="h-5 w-5" />
            <span>Commencer gratuitement</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-white/80 text-sm">Aucune carte bancaire requise · Essai gratuit</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
