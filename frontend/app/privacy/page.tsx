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
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="text-gray-600 mb-8">
              <strong>Responsable du traitement :</strong> Vidova<br/>
              <strong>Adresse :</strong> [Adresse à définir]<br/>
              <strong>Email :</strong> privacy@vidova.me<br/>
              <strong>Délégué à la protection des données :</strong> dpo@vidova.me
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                La présente politique de confidentialité explique comment Vidova ("nous", "notre", "nos") collecte,
                utilise, stocke et protège vos données personnelles lorsque vous utilisez notre plateforme de création
                de contenu alimentée par IA.
              </p>
              <p className="text-gray-700">
                Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi
                Informatique et Libertés. Nous nous engageons à protéger votre vie privée et vos droits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons les données suivantes :
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Données fournies directement</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Informations de compte :</strong> Email, nom, prénom, mot de passe hashé</li>
                <li><strong>Contenu utilisateur :</strong> Vidéos YouTube uploadées, textes saisis</li>
                <li><strong>Préférences :</strong> Paramètres de langue, notifications, style de contenu</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Données collectées automatiquement</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation</li>
                <li><strong>Données d'usage :</strong> Pages visitées, temps passé, fonctionnalités utilisées</li>
                <li><strong>Cookies et technologies similaires :</strong> Voir section 7</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Données provenant de tiers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Google OAuth :</strong> Email, nom, avatar (si connexion via Google)</li>
                <li><strong>TikTok API :</strong> Statistiques de compte, informations de profil (avec consentement)</li>
                <li><strong>YouTube API :</strong> Métadonnées de vidéos (titre, durée, etc.)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <p className="text-gray-700 mb-4">
                Vos données sont traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Fournir nos services :</strong> Création de compte, traitement des vidéos, génération de contenu</li>
                <li><strong>Améliorer l'expérience :</strong> Personnalisation, recommandations, support technique</li>
                <li><strong>Assurer la sécurité :</strong> Détection des fraudes, prévention des abus</li>
                <li><strong>Respecter nos obligations légales :</strong> Conformité RGPD, comptabilité</li>
                <li><strong>Communications marketing :</strong> Avec votre consentement préalable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Base légale du traitement</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, nous traitons vos données sur les bases légales suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Exécution du contrat :</strong> Pour fournir les services demandés</li>
                <li><strong>Consentement :</strong> Pour les intégrations tierces et communications marketing</li>
                <li><strong>Intérêt légitime :</strong> Pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Obligation légale :</strong> Pour respecter nos obligations juridiques</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Partage des données</h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons pas vos données personnelles. Elles peuvent être partagées dans les cas suivants :
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Prestataires de services</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Hébergement :</strong> OVH, AWS (données chiffrées, contrats RGPD)</li>
                <li><strong>IA :</strong> OpenAI, Anthropic (traitement anonymisé)</li>
                <li><strong>Paiements :</strong> Stripe (conforme PCI DSS)</li>
                <li><strong>Analytics :</strong> Vercel Analytics (anonymisé)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Obligations légales</h3>
              <p className="text-gray-700 mb-4">
                Nous pouvons être amenés à divulguer vos données si la loi l'exige (demande judiciaire, enquête, etc.).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Transferts internationaux</h3>
              <p className="text-gray-700">
                Certaines données peuvent être transférées vers des pays hors UE. Nous nous assurons que ces transferts
                sont sécurisés et conformes au RGPD (clauses contractuelles types, adequacy decisions).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Durée de conservation</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données pour les durées suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Données de compte :</strong> Durée de votre abonnement + 3 ans</li>
                <li><strong>Vidéos et contenu généré :</strong> 2 ans après suppression du compte</li>
                <li><strong>Données de paiement :</strong> 7 ans (obligation légale)</li>
                <li><strong>Logs techniques :</strong> 1 an</li>
                <li><strong>Cookies :</strong> Selon la section 7</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies et technologies similaires</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons différents types de cookies :
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Cookies essentiels</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Authentification :</strong> Gestion de session (7 jours)</li>
                <li><strong>Préférences :</strong> Langue, thème (1 an)</li>
                <li><strong>Sécurité :</strong> Protection CSRF (session)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Cookies analytiques</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Vercel Analytics :</strong> Usage anonymisé (1 an)</li>
                <li><strong>Performance :</strong> Métriques de performance (30 jours)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Cookies tiers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Google OAuth :</strong> Authentification (session)</li>
                <li><strong>TikTok :</strong> Avec consentement explicite (30 jours)</li>
              </ul>

              <p className="text-gray-700 mt-4">
                Vous pouvez gérer vos préférences cookies via les paramètres de votre navigateur.
                La désactivation de certains cookies peut affecter le fonctionnement du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Chiffrement :</strong> Données en transit (TLS 1.3) et au repos</li>
                <li><strong>Accès contrôlé :</strong> Authentification multi-facteurs, logs d'accès</li>
                <li><strong>Surveillance :</strong> Détection d'intrusions 24/7</li>
                <li><strong>Sauvegardes :</strong> Régulières et chiffrées</li>
                <li><strong>Audits :</strong> Sécurité trimestriels</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Vos droits RGPD</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Droit d'accès :</strong> Connaître les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Supprimer vos données ("droit à l'oubli")</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Refuser certains traitements</li>
                <li><strong>Droit à la limitation :</strong> Restreindre temporairement le traitement</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, contactez-nous à privacy@vidova.me avec une preuve d'identité.
                Nous répondrons dans un délai d'un mois maximum.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications de la politique</h2>
              <p className="text-gray-700 mb-4">
                Cette politique peut être modifiée pour refléter les évolutions de nos services ou de la législation.
                Les modifications importantes vous seront notifiées par email 30 jours avant leur entrée en vigueur.
              </p>
              <p className="text-gray-700">
                La version actuelle est toujours disponible sur https://vidova.me/privacy
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>DPO :</strong> dpo@vidova.me</li>
                <li><strong>Support confidentialité :</strong> privacy@vidova.me</li>
                <li><strong>Support général :</strong> support@vidova.me</li>
                <li><strong>Adresse postale :</strong> [Adresse à définir]</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez également exercer vos droits via notre portail utilisateur dans la section "Confidentialité".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Réclamation</h2>
              <p className="text-gray-700">
                Si vous estimez que vos droits n'ont pas été respectés, vous pouvez déposer une réclamation auprès
                de la CNIL (Commission Nationale de l'Informatique et des Libertés) via leur site web www.cnil.fr
                ou par courrier à l'adresse : 3 Place de Fontenoy, 75007 Paris.
              </p>
            </section>

            <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Engagement :</strong> Vidova s'engage à traiter vos données avec la plus grande confidentialité
                et à respecter vos droits. Votre confiance est notre priorité absolue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
