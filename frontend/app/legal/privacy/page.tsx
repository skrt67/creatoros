'use client';

import { Shield, Eye, Lock, Database, Cookie, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function PolitiqueConfidentialite() {
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
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                Vidova s'engage à protéger votre vie privée et vos données personnelles. Cette politique 
                de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations 
                conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary-600" />
              Données collectées
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Données d'identification</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Nom et prénom</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Adresse email</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Mot de passe (crypté)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Données d'utilisation</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Vidéos soumises et transcriptions générées</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Workspaces et contenus créés</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Logs d'utilisation de la plateforme</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Données techniques</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Adresse IP</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Type de navigateur et appareil</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Cookies et technologies similaires</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary-600" />
              Utilisation des données
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">Nous utilisons vos données personnelles pour :</p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">✓ Fournir et gérer nos services de transcription et génération de contenu</li>
                <li className="text-gray-700">✓ Créer et gérer votre compte utilisateur</li>
                <li className="text-gray-700">✓ Traiter vos vidéos et générer des transcriptions</li>
                <li className="text-gray-700">✓ Améliorer nos services et développer de nouvelles fonctionnalités</li>
                <li className="text-gray-700">✓ Vous envoyer des notifications concernant votre compte</li>
                <li className="text-gray-700">✓ Assurer la sécurité de la plateforme</li>
                <li className="text-gray-700">✓ Respecter nos obligations légales</li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Base légale du traitement</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">Exécution du contrat :</strong> Le traitement de vos données 
                est nécessaire pour l'exécution du contrat de service que vous avez accepté.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Intérêt légitime :</strong> Nous traitons certaines données 
                pour améliorer nos services et assurer la sécurité de la plateforme.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Consentement :</strong> Pour certaines communications marketing 
                et l'utilisation de cookies non essentiels.
              </p>
            </div>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary-600" />
              Conservation des données
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">• <strong>Données de compte :</strong> Jusqu'à la suppression de votre compte + 30 jours</li>
                <li className="text-gray-700">• <strong>Contenus créés :</strong> Jusqu'à leur suppression manuelle ou la fermeture du compte</li>
                <li className="text-gray-700">• <strong>Logs techniques :</strong> 12 mois maximum</li>
                <li className="text-gray-700">• <strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              </ul>
            </div>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Partage des données</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">• <strong>Services d'IA :</strong> Pour la transcription et la génération de contenu (OpenAI, Google)</li>
                <li className="text-gray-700">• <strong>Hébergeurs :</strong> Pour le stockage sécurisé de vos données</li>
                <li className="text-gray-700">• <strong>Services de paiement :</strong> Pour le traitement des transactions</li>
                <li className="text-gray-700">• <strong>Services d'analyse :</strong> Pour améliorer nos services (données anonymisées)</li>
              </ul>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary-600" />
              Vos droits
            </h2>
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit d'accès</h3>
                  <p className="text-sm text-gray-600">Accéder à vos données personnelles</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit de rectification</h3>
                  <p className="text-sm text-gray-600">Corriger vos données inexactes</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit à l'effacement</h3>
                  <p className="text-sm text-gray-600">Supprimer vos données</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit à la portabilité</h3>
                  <p className="text-sm text-gray-600">Récupérer vos données</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h3>
                  <p className="text-sm text-gray-600">Vous opposer au traitement</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit à la limitation</h3>
                  <p className="text-sm text-gray-600">Limiter le traitement</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary-600" />
              Sécurité des données
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">🔒 Chiffrement des données en transit (HTTPS/TLS)</li>
                <li className="text-gray-700">🔒 Chiffrement des mots de passe (bcrypt)</li>
                <li className="text-gray-700">🔒 Hébergement sécurisé avec sauvegardes régulières</li>
                <li className="text-gray-700">🔒 Contrôle d'accès strict aux données</li>
                <li className="text-gray-700">🔒 Surveillance et détection des incidents</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cookie className="h-6 w-6 text-primary-600" />
              Cookies
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                Nous utilisons des cookies pour améliorer votre expérience :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">• <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification)</li>
                <li className="text-gray-700">• <strong>Cookies de performance :</strong> Pour analyser l'utilisation du site</li>
                <li className="text-gray-700">• <strong>Cookies de préférence :</strong> Pour mémoriser vos paramètres</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary-600" />
              Nous contacter
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant vos données personnelles ou pour exercer vos droits :
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Email :</strong>{' '}
                  <a href="mailto:privacy@creatoros.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                    privacy@creatoros.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-900">Courrier :</strong> Vidova - DPO, 123 Avenue des Champs-Élysées, 75008 Paris
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">www.cnil.fr</a>
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec une mise à jour de la date.
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
