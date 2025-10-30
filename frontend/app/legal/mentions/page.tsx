'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Éditeur du site</h2>
              <div className="text-gray-700">
                <p><strong>Vidova</strong></p>
                <p>Service de création de contenu IA</p>
                <p>Adresse : [Adresse à définir]</p>
                <p>Email : contact@vidova.me</p>
                <p>SIRET : [Numéro à définir]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hébergement</h2>
              <div className="text-gray-700">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789</p>
                <p>États-Unis</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700">
                Email : legal@vidova.me
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
