'use client';

import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';

export default function ConditionsUtilisation() {
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-base text-gray-600 font-light mb-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-gray max-w-none">
            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme
                    Vidova. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Objet */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">1. Objet</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  Vidova est une plateforme SaaS de transcription vidéo et génération de contenu alimentée par l'IA.
                  Elle permet aux utilisateurs de :
                </p>
                <ul className="space-y-2 text-base text-gray-600 font-light">
                  <li>• Soumettre des vidéos via URL (YouTube, TikTok, etc.) ou upload direct</li>
                  <li>• Obtenir des transcriptions automatiques de haute qualité</li>
                  <li>• Générer différents formats de contenu (articles, threads, scripts, etc.)</li>
                  <li>• Gérer plusieurs workspaces pour organiser leurs projets</li>
                </ul>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Accès au service */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">2. Accès au service</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Inscription</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      L'utilisation de Vidova nécessite la création d'un compte. Vous devez fournir des informations
                      exactes et maintenir vos identifiants confidentiels. Vous êtes responsable de toute activité sur votre compte.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Éligibilité</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      Vous devez être âgé d'au moins 18 ans ou avoir l'autorisation parentale pour utiliser nos services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">2.3 Sécurité</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      Vous vous engagez à ne pas partager vos identifiants, à utiliser un mot de passe sécurisé et à nous
                      informer immédiatement de toute utilisation non autorisée.
                    </p>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Utilisation acceptable */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">3. Utilisation acceptable</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">Vous vous engagez à :</p>
                <ul className="space-y-2 text-base text-gray-600 font-light">
                  <li>• Utiliser la plateforme conformément à la loi et ces CGU</li>
                  <li>• Soumettre uniquement des contenus dont vous détenez les droits</li>
                  <li>• Ne pas tenter de contourner les mesures de sécurité</li>
                  <li>• Respecter les droits de propriété intellectuelle</li>
                  <li>• Ne pas utiliser le service à des fins illégales ou frauduleuses</li>
                </ul>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Interdictions */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">4. Utilisations interdites</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">Il est strictement interdit de :</p>
                <ul className="space-y-2 text-base text-gray-600 font-light">
                  <li>• Soumettre des contenus illégaux, violents, discriminatoires ou pornographiques</li>
                  <li>• Utiliser la plateforme pour du spam, du phishing ou des activités malveillantes</li>
                  <li>• Tenter d'accéder aux comptes d'autres utilisateurs</li>
                  <li>• Surcharger ou perturber le fonctionnement de la plateforme</li>
                  <li>• Copier, modifier ou distribuer le code source de Vidova</li>
                  <li>• Revendre ou redistribuer les services sans autorisation écrite</li>
                </ul>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Propriété intellectuelle */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">5. Propriété intellectuelle</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">5.1 Propriété de Vidova</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      Tous les éléments de la plateforme (code, design, marques, logos) sont la propriété exclusive
                      de Vidova et sont protégés par le droit d'auteur et les lois sur la propriété intellectuelle.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">5.2 Contenu utilisateur</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      Vous conservez tous les droits sur vos contenus soumis. Vous accordez à Vidova une licence
                      limitée pour traiter vos vidéos et générer des transcriptions/contenus. Cette licence expire
                      lorsque vous supprimez vos contenus.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">5.3 Contenus générés</h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      Les transcriptions et contenus générés vous appartiennent. Vous êtes libre de les utiliser,
                      modifier et distribuer comme bon vous semble.
                    </p>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Tarification */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">6. Tarification et paiement</h2>
                <div className="space-y-3">
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">6.1 Plans disponibles :</span> Nous proposons différents
                    plans tarifaires (gratuit, premium, entreprise) détaillés sur notre page de tarification.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">6.2 Paiement :</span> Les paiements sont traités via des
                    prestataires sécurisés (Stripe). Vous acceptez de fournir des informations de paiement valides.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">6.3 Renouvellement :</span> Les abonnements sont renouvelés
                    automatiquement. Vous pouvez annuler à tout moment depuis votre compte.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">6.4 Remboursement :</span> Les paiements sont généralement
                    non remboursables sauf exception prévue par la loi ou notre politique de remboursement.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Disponibilité */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">7. Disponibilité et garanties</h2>
                <div className="space-y-3">
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">7.1 Disponibilité :</span> Nous nous efforçons de maintenir
                    la plateforme disponible 24/7 mais ne garantissons pas une disponibilité ininterrompue. Des
                    maintenances planifiées peuvent avoir lieu.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">7.2 Qualité :</span> Bien que nous utilisions des technologies
                    avancées, la qualité des transcriptions et contenus générés peut varier selon les sources.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">7.3 Sauvegarde :</span> Nous recommandons de sauvegarder
                    régulièrement vos contenus importants.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Responsabilité */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">8. Limitation de responsabilité</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
                  Vidova ne peut être tenu responsable :
                </p>
                <ul className="space-y-2 text-base text-gray-600 font-light mb-4">
                  <li>• Des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service</li>
                  <li>• De la perte de données, de profits ou d'opportunités commerciales</li>
                  <li>• Des contenus soumis par les utilisateurs</li>
                  <li>• Des interruptions de service dues à des cas de force majeure</li>
                  <li>• Des erreurs dans les transcriptions ou contenus générés par l'IA</li>
                </ul>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  En tout état de cause, notre responsabilité est limitée au montant payé par l'utilisateur
                  au cours des 12 derniers mois.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Résiliation */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">9. Résiliation</h2>
                <div className="space-y-3">
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">9.1 Par l'utilisateur :</span> Vous pouvez fermer votre compte
                    à tout moment depuis les paramètres. La fermeture entraîne la suppression définitive de vos données
                    après 30 jours.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">9.2 Par Vidova :</span> Nous nous réservons le droit de
                    suspendre ou fermer un compte en cas de violation des CGU, d'activité suspecte ou frauduleuse.
                  </p>
                  <p className="text-base text-gray-600 font-light leading-relaxed">
                    <span className="font-medium text-gray-900">9.3 Effet :</span> La résiliation met fin immédiatement à
                    l'accès aux services. Les paiements effectués ne sont pas remboursables sauf exception légale.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Modifications */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">10. Modifications des CGU</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications importantes
                  seront notifiées par email 30 jours avant leur entrée en vigueur. L'utilisation continue du
                  service après notification vaut acceptation des nouvelles conditions.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Droit applicable */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">11. Droit applicable et juridiction</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Les présentes CGU sont régies par le droit français. En cas de litige, après tentative de
                  résolution amiable, les tribunaux de Paris seront seuls compétents.
                </p>
              </section>

              <div className="h-px bg-gray-200/60"></div>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">12. Contact</h2>
                <p className="text-base text-gray-600 font-light leading-relaxed">
                  Pour toute question concernant ces CGU, contactez-nous à{' '}
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
