'use client';

import { Briefcase, MapPin, Clock, TrendingUp, Heart, Code, Palette, BarChart, ArrowRight, ArrowLeft, Zap, Users, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function CareersPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Évolution rapide',
      description: 'Opportunités de croissance et de développement dans une startup en pleine expansion'
    },
    {
      icon: Heart,
      title: 'Bien-être',
      description: 'Télétravail flexible, mutuelle premium, et équilibre vie pro/perso respecté'
    },
    {
      icon: Users,
      title: 'Équipe passionnée',
      description: 'Travaillez avec des talents exceptionnels qui adorent ce qu\'ils font'
    },
    {
      icon: Rocket,
      title: 'Impact réel',
      description: 'Votre travail impacte directement des milliers de créateurs chaque jour'
    },
    {
      icon: Zap,
      title: 'Tech de pointe',
      description: 'Travaillez avec les dernières technologies (IA, Cloud, React, etc.)'
    },
    {
      icon: Code,
      title: 'Formation continue',
      description: 'Budget formation, conférences, et accès à des ressources d\'apprentissage'
    },
  ];

  const openPositions = [
    {
      id: '1',
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      icon: Code,
      description: 'Construisez les fonctionnalités qui transforment la création de contenu. React, TypeScript, Python, FastAPI.',
      skills: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL']
    },
    {
      id: '2',
      title: 'ML Engineer - NLP',
      department: 'AI & Research',
      location: 'Paris / Remote',
      type: 'CDI',
      icon: Zap,
      description: 'Améliorez nos modèles de transcription et génération de contenu. Expertise en NLP requise.',
      skills: ['Python', 'PyTorch', 'Transformers', 'NLP', 'MLOps']
    },
    {
      id: '3',
      title: 'Product Designer',
      department: 'Design',
      location: 'Paris / Remote',
      type: 'CDI',
      icon: Palette,
      description: 'Créez des expériences utilisateur exceptionnelles pour nos créateurs. UI/UX, Figma.',
      skills: ['Figma', 'UI/UX', 'Design System', 'Prototyping', 'User Research']
    },
    {
      id: '4',
      title: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'Paris',
      type: 'CDI',
      icon: TrendingUp,
      description: 'Développez notre acquisition et rétention utilisateurs. SEO, content, paid ads.',
      skills: ['SEO', 'Content Marketing', 'Analytics', 'Paid Ads', 'Growth Hacking']
    },
    {
      id: '5',
      title: 'Customer Success Manager',
      department: 'Customer',
      location: 'Paris / Remote',
      type: 'CDI',
      icon: Heart,
      description: 'Assurez le succès et la satisfaction de nos utilisateurs premium et entreprise.',
      skills: ['Customer Success', 'Communication', 'SaaS', 'Problem Solving']
    },
    {
      id: '6',
      title: 'Data Analyst',
      department: 'Data',
      location: 'Paris / Remote',
      type: 'CDI',
      icon: BarChart,
      description: 'Analysez nos données pour guider les décisions produit et business.',
      skills: ['SQL', 'Python', 'Data Viz', 'Analytics', 'A/B Testing']
    },
  ];

  const culture = [
    '🚀 Startup dynamique et innovante',
    '💡 Autonomie et prise d\'initiative encouragées',
    '🤝 Collaboration et transparence',
    '🎯 Focus sur l\'impact et les résultats',
    '🌍 Diversité et inclusion',
    '🎉 Team buildings et événements réguliers',
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

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Construisons l'Avenir de la Création de Contenu
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Rejoignez une équipe passionnée qui transforme la façon dont des milliers de créateurs travaillent chaque jour
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
            <Briefcase className="h-5 w-5" />
            <span className="font-bold">{openPositions.length} postes ouverts</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Pourquoi CreatorOS ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des avantages qui font la différence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-500 hover:shadow-xl transition-all group"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Notre Culture
            </h2>
            <p className="text-xl text-gray-600">
              Ce qui définit CreatorOS au quotidien
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {culture.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <p className="text-lg font-semibold text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Postes Ouverts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez votre prochaine aventure
            </p>
          </div>
          <div className="space-y-6">
            {openPositions.map((position) => {
              const Icon = position.icon;
              return (
                <div 
                  key={position.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 border-gray-200 hover:border-primary-500 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {position.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {position.department}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {position.location}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {position.type}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{position.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {position.skills.map((skill, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/careers/${position.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      <span>Postuler</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Envoyez-nous une candidature spontanée ! Nous sommes toujours à la recherche de talents exceptionnels.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl"
          >
            <span>Candidature spontanée</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
