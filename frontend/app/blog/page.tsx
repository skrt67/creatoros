'use client';

import { Calendar, Clock, Tag, ArrowRight, ArrowLeft, TrendingUp, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';

export default function BlogPage() {
  const featuredPost = {
    id: '1',
    title: 'Comment l\'IA transforme la création de contenu en 2025',
    excerpt: 'Découvrez les dernières tendances et innovations qui révolutionnent la façon dont les créateurs produisent du contenu.',
    category: 'IA & Technologie',
    date: '2025-01-15',
    readTime: '8 min',
    image: '🤖',
    author: 'Marie Laurent',
    featured: true
  };

  const blogPosts = [
    {
      id: '2',
      title: '10 astuces pour optimiser vos transcriptions vidéo',
      excerpt: 'Des conseils pratiques pour tirer le meilleur parti de vos transcriptions automatiques.',
      category: 'Guide pratique',
      date: '2025-01-12',
      readTime: '5 min',
      image: '📝',
      author: 'Thomas Martin'
    },
    {
      id: '3',
      title: 'Automatiser votre stratégie de contenu avec Vidova',
      excerpt: 'Comment gagner 10h par semaine en automatisant votre création de contenu.',
      category: 'Productivité',
      date: '2025-01-10',
      readTime: '6 min',
      image: '⚡',
      author: 'Sophie Bernard'
    },
    {
      id: '4',
      title: 'Les secrets des créateurs qui cartonnent sur TikTok',
      excerpt: 'Analyse des stratégies des tops créateurs et comment les reproduire.',
      category: 'Social Media',
      date: '2025-01-08',
      readTime: '7 min',
      image: '🎥',
      author: 'Jean Dupont'
    },
    {
      id: '5',
      title: 'Comment générer des articles de blog à partir de vidéos',
      excerpt: 'Transformez vos vidéos en articles SEO-optimisés en quelques clics.',
      category: 'SEO & Content',
      date: '2025-01-05',
      readTime: '5 min',
      image: '📰',
      author: 'Marie Laurent'
    },
    {
      id: '6',
      title: 'L\'avenir du marketing de contenu',
      excerpt: 'Tendances 2025 : ce que les marketeurs doivent savoir.',
      category: 'Marketing',
      date: '2025-01-03',
      readTime: '9 min',
      image: '🚀',
      author: 'Sophie Bernard'
    },
    {
      id: '7',
      title: 'Créer des threads Twitter viraux depuis vos vidéos',
      excerpt: 'La méthode complète pour convertir vos vidéos en threads engageants.',
      category: 'Social Media',
      date: '2024-12-28',
      readTime: '6 min',
      image: '🐦',
      author: 'Thomas Martin'
    },
  ];

  const categories = [
    { name: 'Tous', count: blogPosts.length + 1 },
    { name: 'IA & Technologie', count: 3 },
    { name: 'Guide pratique', count: 2 },
    { name: 'Marketing', count: 2 },
    { name: 'Social Media', count: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Blog Vidova</h1>
            <p className="text-xl text-gray-600">
              Conseils, guides et actualités pour booster votre création de contenu
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 text-white">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                  ⭐ Article vedette
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                  {featuredPost.category}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-6 mb-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(featuredPost.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{featuredPost.readTime} de lecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Par {featuredPost.author}</span>
                </div>
              </div>
              <Link
                href={`/blog/${featuredPost.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl"
              >
                <span>Lire l'article</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-500'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="p-8">
                {/* Icon/Image */}
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {post.image}
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
                  >
                    <span>Lire</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20">
          <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">Ne manquez aucun article</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Recevez nos meilleurs conseils et actualités directement dans votre boîte mail
            </p>
            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 font-medium focus:ring-4 focus:ring-white/50 outline-none"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl"
              >
                S'abonner
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
