'use client';

import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';

export default function PrivacyPage() {
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
            Politique de confidentialité
          </h1>
          <p className="text-base text-gray-600 font-light mb-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-gray max-w-none">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">1. Collecte des données</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  Nous collectons les informations que vous nous fournissez directement lorsque vous créez un compte, utilisez nos services ou nous contactez.
                </p>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Ces informations incluent votre nom, adresse email, et les vidéos que vous soumettez pour traitement.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">2. Utilisation des données</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  Nous utilisons vos données pour :
                </p>
                <ul className="space-y-2 text-base text-gray-600 font-light">
                  <li>• Fournir et améliorer nos services</li>
                  <li>• Traiter vos vidéos et générer du contenu</li>
                  <li>• Communiquer avec vous concernant votre compte</li>
                  <li>• Assurer la sécurité de notre plateforme</li>
                </ul>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">3. Partage des données</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Nous ne vendons pas vos données personnelles. Nous ne partageons vos informations qu'avec des prestataires de services essentiels au fonctionnement de notre plateforme.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">4. Sécurité</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé, modification ou destruction.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">5. Vos droits</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  Vous disposez des droits suivants concernant vos données :
                </p>
                <ul className="space-y-2 text-base text-gray-600 font-light">
                  <li>• Accès à vos données personnelles</li>
                  <li>• Rectification de vos données</li>
                  <li>• Suppression de votre compte</li>
                  <li>• Opposition au traitement de vos données</li>
                </ul>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">6. Contact</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité, contactez-nous à{' '}
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
