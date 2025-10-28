'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Collecte des données</h2>
              <p className="text-gray-700 mb-4">
                Vidova collecte les données suivantes pour fournir ses services :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Informations de compte (email, nom)</li>
                <li>Vidéos YouTube que vous soumettez pour traitement</li>
                <li>Données d'utilisation de la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
              <p className="text-gray-700 mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter vos vidéos avec l'IA</li>
                <li>Communiquer avec vous concernant votre compte</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Protection des données</h2>
              <p className="text-gray-700">
                Nous utilisons des mesures de sécurité conformes aux standards de l'industrie pour protéger vos données.
                Toutes les communications sont chiffrées via HTTPS.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Vous avez le droit de :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos informations</li>
                <li>Supprimer votre compte et vos données</li>
                <li>Exporter vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact</h2>
              <p className="text-gray-700">
                Pour toute question concernant cette politique de confidentialité, contactez-nous à{' '}
                <a href="mailto:privacy@creatoros.com" className="text-primary-600 hover:underline">
                  privacy@creatoros.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
