'use client';

import { Building2, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Éditeur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary-600" />
              Éditeur du site
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">Raison sociale :</strong> Vidova SAS
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Forme juridique :</strong> Société par Actions Simplifiée
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Capital social :</strong> 10 000 €
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">SIRET :</strong> XXX XXX XXX XXXXX
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">RCS :</strong> Paris B XXX XXX XXX
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">N° TVA intracommunautaire :</strong> FR XX XXXXXXXXX
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary-600" />
              Coordonnées
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Siège social</p>
                  <p className="text-gray-700">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris<br />
                    France
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:contact@creatoros.com" className="text-primary-600 hover:text-primary-700">
                    contact@creatoros.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Téléphone</p>
                  <a href="tel:+33123456789" className="text-primary-600 hover:text-primary-700">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de la publication</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                <strong className="text-gray-900">Nom :</strong> [Nom du Directeur]
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-900">Qualité :</strong> Président
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">Hébergeur :</strong> [Nom de l'hébergeur - ex: Vercel, AWS, OVH]
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Adresse :</strong> [Adresse de l'hébergeur]
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Site web :</strong>{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  [URL de l'hébergeur]
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
                documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p className="text-gray-700 mt-4">
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données personnelles</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement 
                Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, 
                de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse :{' '}
                <a href="mailto:privacy@creatoros.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  privacy@creatoros.com
                </a>
              </p>
              <p className="text-gray-700 mt-4">
                Pour plus d'informations, consultez notre{' '}
                <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
