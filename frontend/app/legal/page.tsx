'use client';

import Link from 'next/link';
import { Shield, FileText, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function LegalHub() {
  const legalPages = [
    {
      title: 'Mentions Légales',
      description: 'Informations sur l\'éditeur du site, coordonnées et hébergement',
      icon: Building2,
      href: '/legal/mentions',
      color: 'from-primary-500 to-purple-600',
      bgColor: 'from-primary-50 to-purple-50',
      borderColor: 'border-primary-200'
    },
    {
      title: 'Politique de Confidentialité',
      description: 'Comment nous collectons, utilisons et protégeons vos données personnelles (RGPD)',
      icon: Shield,
      href: '/legal/privacy',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Documentation Légale</h1>
            <p className="text-lg text-gray-600">
              Toutes les informations légales concernant Vidova
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {legalPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-transparent"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${page.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${page.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Text */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {page.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed min-h-[4rem]">
                    {page.description}
                  </p>

                  {/* Button */}
                  <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Lire la suite</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Bottom border accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${page.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </Link>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Si vous avez des questions concernant nos politiques légales ou la protection de vos données,
              n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@creatoros.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Shield className="h-5 w-5" />
                <span>Contactez notre équipe légale</span>
              </a>
              <Link
                href="/help"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-primary-500 transition-all"
              >
                <span>Centre d'aide</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Last update */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
