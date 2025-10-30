'use client';

import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';

export default function MentionsLegalesPage() {
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

            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-light">Retour</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Mentions Légales
          </h1>
          <p className="text-base text-gray-600 font-light mb-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-gray max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Éditeur du site</h2>
                <div className="space-y-2 text-base text-gray-600 font-light leading-relaxed">
                  <p><span className="font-medium text-gray-900">Vidova</span></p>
                  <p>Service de création de contenu IA</p>
                  <p>Email : <a href="mailto:contact.vidova@gmail.com" className="text-gray-900 hover:underline font-medium">contact.vidova@gmail.com</a></p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Hébergement</h2>
                <div className="space-y-2 text-base text-gray-600 font-light leading-relaxed">
                  <p><span className="font-medium text-gray-900">Vercel Inc.</span></p>
                  <p>340 S Lemon Ave #4133</p>
                  <p>Walnut, CA 91789</p>
                  <p>États-Unis</p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Responsable de la publication</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Le directeur de la publication est le responsable légal de Vidova.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Propriété intellectuelle</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de Vidova, sauf mention contraire.
                </p>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Contact</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Pour toute question concernant les mentions légales, contactez-nous à{' '}
                  <a href="mailto:contact.vidova@gmail.com" className="text-gray-900 hover:underline font-medium">
                    contact.vidova@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
