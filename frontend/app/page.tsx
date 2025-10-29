'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
      <section className="relative px-6 lg:px-12 pt-32 pb-48 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.png"
            alt="Vidova Platform"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80"></div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10">
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

    </div>
  );
}
