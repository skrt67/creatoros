'use client';

import { Target, Users, Rocket, Heart, Award, TrendingUp, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  const stats = [
    { label: 'Utilisateurs actifs', value: '10K+', icon: Users },
    { label: 'Vidéos traitées', value: '500K+', icon: Zap },
    { label: 'Contenu généré', value: '2M+', icon: TrendingUp },
    { label: 'Taux de satisfaction', value: '98%', icon: Award },
  ];

  const values = [
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'Nous repoussons les limites de l\'IA pour créer des outils qui transforment vraiment la création de contenu.'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Nous plaçons notre communauté de créateurs au cœur de tout ce que nous faisons.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes passionnés par l\'aide aux créateurs à réussir et à développer leur audience.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans chaque fonctionnalité, chaque interaction, chaque ligne de code.'
    },
  ];

  const team = [
    {
      name: 'Jean Dupont',
      role: 'CEO & Co-fondateur',
      image: '👨‍💼',
      bio: 'Entrepreneur passionné par l\'IA et le content marketing depuis 10 ans.'
    },
    {
      name: 'Marie Laurent',
      role: 'CTO & Co-fondatrice',
      image: '👩‍💻',
      bio: 'Experte en Machine Learning et architecture cloud, anciennement chez Google.'
    },
    {
      name: 'Thomas Martin',
      role: 'Head of Product',
      image: '👨‍🎨',
      bio: 'Designer produit avec une expertise en UX pour les outils créatifs.'
    },
    {
      name: 'Sophie Bernard',
      role: 'Head of Growth',
      image: '👩‍💼',
      bio: 'Spécialiste du growth marketing, a fait évoluer plusieurs startups SaaS.'
    },
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Notre Mission : Démocratiser la Création de Contenu
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Nous croyons que chaque créateur mérite des outils puissants pour transformer ses idées en contenu viral. 
              CreatorOS rend l'IA accessible à tous.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="flex items-center gap-3 mb-8">
              <Target className="h-8 w-8 text-primary-600" />
              <h2 className="text-4xl font-black text-gray-900">Notre Histoire</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                CreatorOS est né d'une frustration : créer du contenu de qualité à partir de vidéos prenait trop de temps. 
                En 2024, nos fondateurs ont décidé de changer cela.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Avec une expertise combinée de plus de 20 ans dans l'IA, le développement logiciel et le content marketing, 
                nous avons construit une plateforme qui transforme radicalement la façon dont les créateurs travaillent.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aujourd'hui, des milliers de créateurs, marketeurs et entreprises utilisent CreatorOS pour générer des 
                millions de contenus chaque mois. Et nous ne faisons que commencer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les talents qui rendent CreatorOS possible
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-500 hover:shadow-xl transition-all group text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Rejoignez l'Aventure
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nous recrutons ! Découvrez nos opportunités et construisez l'avenir de la création de contenu avec nous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
            >
              <Users className="h-5 w-5" />
              <span>Voir les postes</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border-2 border-white/20"
            >
              <span>Nous contacter</span>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
