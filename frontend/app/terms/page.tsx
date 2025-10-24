'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Conditions d'Utilisation
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptation des conditions</h2>
              <p className="text-gray-700">
                En utilisant CreatorOS, vous acceptez les présentes conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description du service</h2>
              <p className="text-gray-700 mb-4">
                CreatorOS est une plateforme d'automatisation de contenu pour créateurs YouTube qui :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Télécharge et analyse vos vidéos YouTube</li>
                <li>Génère automatiquement des transcriptions</li>
                <li>Crée du contenu optimisé (threads, posts, etc.)</li>
                <li>Automatise votre présence sur les réseaux sociaux</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compte utilisateur</h2>
              <p className="text-gray-700 mb-4">
                Vous êtes responsable de :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>La confidentialité de votre mot de passe</li>
                <li>Toutes les activités effectuées depuis votre compte</li>
                <li>La véracité des informations fournies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Utilisation acceptable</h2>
              <p className="text-gray-700 mb-4">
                Vous vous engagez à ne pas :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Utiliser le service à des fins illégales</li>
                <li>Violer les droits de propriété intellectuelle</li>
                <li>Tenter d'accéder aux comptes d'autres utilisateurs</li>
                <li>Surcharger ou perturber nos serveurs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
              <p className="text-gray-700">
                Le contenu généré par CreatorOS vous appartient. Nous conservons les droits sur la plateforme 
                et ses algorithmes. Vous nous accordez une licence pour traiter votre contenu afin de fournir nos services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
              <p className="text-gray-700">
                CreatorOS est fourni "tel quel" sans garantie. Nous ne sommes pas responsables des dommages 
                résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modifications</h2>
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier ces conditions à tout moment. 
                Les modifications seront notifiées par email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700">
                Pour toute question, contactez-nous à{' '}
                <a href="mailto:support@creatoros.com" className="text-primary-600 hover:underline">
                  support@creatoros.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
