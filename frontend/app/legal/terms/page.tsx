'use client';

import { FileText, CheckSquare, XCircle, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function ConditionsUtilisation() {
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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme 
                CreatorOS. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.
              </p>
            </div>
          </section>

          {/* Objet */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                CreatorOS est une plateforme SaaS de transcription vidéo et génération de contenu alimentée par l'IA. 
                Elle permet aux utilisateurs de :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">• Soumettre des vidéos via URL (YouTube, TikTok, etc.) ou upload direct</li>
                <li className="text-gray-700">• Obtenir des transcriptions automatiques de haute qualité</li>
                <li className="text-gray-700">• Générer différents formats de contenu (articles, threads, scripts, etc.)</li>
                <li className="text-gray-700">• Gérer plusieurs workspaces pour organiser leurs projets</li>
              </ul>
            </div>
          </section>

          {/* Accès au service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accès au service</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Inscription</h3>
                <p className="text-gray-700">
                  L'utilisation de CreatorOS nécessite la création d'un compte. Vous devez fournir des informations 
                  exactes et maintenir vos identifiants confidentiels. Vous êtes responsable de toute activité sur votre compte.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Éligibilité</h3>
                <p className="text-gray-700">
                  Vous devez être âgé d'au moins 18 ans ou avoir l'autorisation parentale pour utiliser nos services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Sécurité</h3>
                <p className="text-gray-700">
                  Vous vous engagez à ne pas partager vos identifiants, à utiliser un mot de passe sécurisé et à nous 
                  informer immédiatement de toute utilisation non autorisée.
                </p>
              </div>
            </div>
          </section>

          {/* Utilisation du service */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-green-600" />
              3. Utilisation acceptable
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-gray-700 mb-3">Vous vous engagez à :</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Utiliser la plateforme conformément à la loi et ces CGU</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Soumettre uniquement des contenus dont vous détenez les droits</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ne pas tenter de contourner les mesures de sécurité</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respecter les droits de propriété intellectuelle</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ne pas utiliser le service à des fins illégales ou frauduleuses</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Interdictions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              4. Utilisations interdites
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-gray-700 mb-3">Il est strictement interdit de :</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Soumettre des contenus illégaux, violents, discriminatoires ou pornographiques</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Utiliser la plateforme pour du spam, du phishing ou des activités malveillantes</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Tenter d'accéder aux comptes d'autres utilisateurs</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Surcharger ou perturber le fonctionnement de la plateforme</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Copier, modifier ou distribuer le code source de CreatorOS</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Revendre ou redistribuer les services sans autorisation écrite</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Propriété de CreatorOS</h3>
                <p className="text-gray-700">
                  Tous les éléments de la plateforme (code, design, marques, logos) sont la propriété exclusive 
                  de CreatorOS et sont protégés par le droit d'auteur et les lois sur la propriété intellectuelle.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Contenu utilisateur</h3>
                <p className="text-gray-700">
                  Vous conservez tous les droits sur vos contenus soumis. Vous accordez à CreatorOS une licence 
                  limitée pour traiter vos vidéos et générer des transcriptions/contenus. Cette licence expire 
                  lorsque vous supprimez vos contenus.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Contenus générés</h3>
                <p className="text-gray-700">
                  Les transcriptions et contenus générés vous appartiennent. Vous êtes libre de les utiliser, 
                  modifier et distribuer comme bon vous semble.
                </p>
              </div>
            </div>
          </section>

          {/* Tarification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tarification et paiement</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">6.1 Plans disponibles :</strong> Nous proposons différents 
                plans tarifaires (gratuit, premium, entreprise) détaillés sur notre page de tarification.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">6.2 Paiement :</strong> Les paiements sont traités via des 
                prestataires sécurisés (Stripe). Vous acceptez de fournir des informations de paiement valides.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">6.3 Renouvellement :</strong> Les abonnements sont renouvelés 
                automatiquement. Vous pouvez annuler à tout moment depuis votre compte.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">6.4 Remboursement :</strong> Les paiements sont généralement 
                non remboursables sauf exception prévue par la loi ou notre politique de remboursement.
              </p>
            </div>
          </section>

          {/* Disponibilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              7. Disponibilité et garanties
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">7.1 Disponibilité :</strong> Nous nous efforçons de maintenir 
                la plateforme disponible 24/7 mais ne garantissons pas une disponibilité ininterrompue. Des 
                maintenances planifiées peuvent avoir lieu.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">7.2 Qualité :</strong> Bien que nous utilisions des technologies 
                avancées, la qualité des transcriptions et contenus générés peut varier selon les sources.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">7.3 Sauvegarde :</strong> Nous recommandons de sauvegarder 
                régulièrement vos contenus importants.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary-600" />
              8. Limitation de responsabilité
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700">
                CreatorOS ne peut être tenu responsable :
              </p>
              <ul className="space-y-2 mt-4">
                <li className="text-gray-700">• Des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service</li>
                <li className="text-gray-700">• De la perte de données, de profits ou d'opportunités commerciales</li>
                <li className="text-gray-700">• Des contenus soumis par les utilisateurs</li>
                <li className="text-gray-700">• Des interruptions de service dues à des cas de force majeure</li>
                <li className="text-gray-700">• Des erreurs dans les transcriptions ou contenus générés par l'IA</li>
              </ul>
              <p className="text-gray-700 mt-4">
                En tout état de cause, notre responsabilité est limitée au montant payé par l'utilisateur 
                au cours des 12 derniers mois.
              </p>
            </div>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Résiliation</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">9.1 Par l'utilisateur :</strong> Vous pouvez fermer votre compte 
                à tout moment depuis les paramètres. La fermeture entraîne la suppression définitive de vos données 
                après 30 jours.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">9.2 Par CreatorOS :</strong> Nous nous réservons le droit de 
                suspendre ou fermer un compte en cas de violation des CGU, d'activité suspecte ou frauduleuse.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">9.3 Effet :</strong> La résiliation met fin immédiatement à 
                l'accès aux services. Les paiements effectués ne sont pas remboursables sauf exception légale.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications des CGU</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications importantes 
                seront notifiées par email 30 jours avant leur entrée en vigueur. L'utilisation continue du 
                service après notification vaut acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Droit applicable et juridiction</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                Les présentes CGU sont régies par le droit français. En cas de litige, après tentative de 
                résolution amiable, les tribunaux de Paris seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200 rounded-xl p-6">
              <p className="text-gray-700 mb-3">
                Pour toute question concernant ces CGU :
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Email :</strong>{' '}
                <a href="mailto:legal@creatoros.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  legal@creatoros.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-900">Courrier :</strong> CreatorOS SAS, 123 Avenue des Champs-Élysées, 75008 Paris
              </p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Version :</strong> 1.0<br />
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
