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
            Conditions Générales d'Utilisation
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="text-gray-600 mb-8">
              <strong>Éditeur :</strong> Vidova - Service de création de contenu IA<br/>
              <strong>Email :</strong> contact@vidova.me<br/>
              <strong>Site web :</strong> https://vidova.me
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Définitions</h2>
              <p className="text-gray-700 mb-4">
                Les termes suivants ont la signification suivante :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>"Vidova"</strong> : La plateforme de création de contenu alimentée par IA</li>
                <li><strong>"Utilisateur"</strong> : Toute personne utilisant les services de Vidova</li>
                <li><strong>"Services"</strong> : L'ensemble des fonctionnalités proposées par Vidova</li>
                <li><strong>"Contenu"</strong> : Vidéos, textes, images générés via la plateforme</li>
                <li><strong>"CGU"</strong> : Les présentes Conditions Générales d'Utilisation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Acceptation des conditions</h2>
              <p className="text-gray-700">
                L'utilisation de Vidova implique l'acceptation pleine et entière des présentes CGU.
                Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement l'utilisation de nos services.
                L'acceptation est matérialisée par la création d'un compte utilisateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Description du service</h2>
              <p className="text-gray-700 mb-4">
                Vidova est une plateforme SaaS d'automatisation de contenu qui permet aux créateurs et entreprises de :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Transformer des vidéos YouTube en contenu multi-format</li>
                <li>Générer automatiquement des transcriptions via IA</li>
                <li>Créer des articles de blog, posts réseaux sociaux, newsletters</li>
                <li>Analyser les performances sur les plateformes sociales</li>
                <li>Automatiser la distribution de contenu</li>
                <li>Intégrer avec TikTok, Google, et autres plateformes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Conditions d'accès aux services</h2>
              <p className="text-gray-700 mb-4">
                L'accès aux services de Vidova est soumis aux conditions suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Être âgé d'au moins 18 ans ou avoir l'autorisation parentale</li>
                <li>Fournir des informations exactes lors de l'inscription</li>
                <li>Posséder une connexion internet fonctionnelle</li>
                <li>Accepter les présentes CGU et notre politique de confidentialité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Création et gestion du compte</h2>
              <p className="text-gray-700 mb-4">
                La création d'un compte est gratuite et nécessite :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Une adresse email valide</li>
                <li>Un mot de passe sécurisé</li>
                <li>L'acceptation des CGU et de la politique de confidentialité</li>
              </ul>
              <p className="text-gray-700 mt-4">
                L'utilisateur est seul responsable de la confidentialité de ses identifiants et de toutes les activités effectuées depuis son compte.
                En cas de suspicion d'utilisation frauduleuse, l'utilisateur doit contacter immédiatement le support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Tarification et paiement</h2>
              <p className="text-gray-700 mb-4">
                Vidova propose différents plans d'abonnement :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Gratuit :</strong> 3 vidéos par mois, fonctionnalités de base</li>
                <li><strong>Pro :</strong> 30 vidéos par mois, IA avancée, support prioritaire</li>
                <li><strong>Entreprise :</strong> Usage illimité, API privée, support dédié</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Les paiements sont traités de manière sécurisée via Stripe. L'abonnement est renouvelé automatiquement sauf résiliation.
                Tout impayé peut entraîner la suspension temporaire des services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Utilisation acceptable du service</h2>
              <p className="text-gray-700 mb-4">
                L'utilisateur s'engage à utiliser Vidova de manière responsable et s'interdit :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Toute utilisation illégale ou frauduleuse</li>
                <li>La violation des droits de propriété intellectuelle d'autrui</li>
                <li>La diffusion de contenu haineux, discriminatoire ou illégal</li>
                <li>Toute tentative d'accès non autorisé aux systèmes</li>
                <li>L'utilisation de bots ou scripts automatisés</li>
                <li>La surcharge intentionnelle des serveurs</li>
                <li>L'usurpation d'identité ou fausse déclaration</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contenu utilisateur et propriété intellectuelle</h2>
              <p className="text-gray-700 mb-4">
                Concernant les vidéos uploadées par l'utilisateur :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>L'utilisateur conserve tous les droits sur ses vidéos originales</li>
                <li>L'utilisateur accorde à Vidova une licence temporaire pour traitement IA</li>
                <li>Le contenu généré appartient à l'utilisateur, sous réserve des droits des tiers</li>
                <li>Vidova conserve les droits sur ses algorithmes et technologies</li>
              </ul>
              <p className="text-gray-700 mt-4">
                L'utilisateur garantit qu'il détient les droits nécessaires sur les vidéos uploadées et qu'elles ne violent pas les droits d'autrui.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intégrations tierces</h2>
              <p className="text-gray-700 mb-4">
                Vidova s'intègre avec diverses plateformes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>YouTube :</strong> Pour l'extraction et l'analyse de vidéos</li>
                <li><strong>TikTok :</strong> Pour l'authentification et les statistiques</li>
                <li><strong>Google :</strong> Pour l'authentification utilisateur</li>
                <li><strong>OpenAI/Anthropic :</strong> Pour la génération de contenu IA</li>
              </ul>
              <p className="text-gray-700 mt-4">
                L'utilisateur accepte les conditions d'utilisation de ces services tiers lors de leur utilisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disponibilité du service</h2>
              <p className="text-gray-700">
                Vidova s'efforce de maintenir une disponibilité de 99.5% du service.
                Cependant, des interruptions temporaires peuvent survenir pour maintenance ou raisons techniques.
                Vidova ne peut être tenu responsable des interruptions dues à des causes extérieures (internet, hébergement, etc.).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation de responsabilité</h2>
              <p className="text-gray-700 mb-4">
                Vidova est fourni "en l'état" sans garantie expresse ou implicite. En particulier :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Nous ne garantissons pas l'exactitude des transcriptions IA</li>
                <li>Nous ne sommes pas responsables des pertes de données</li>
                <li>Notre responsabilité est limitée au montant payé par l'utilisateur</li>
                <li>Nous déclinons toute responsabilité pour dommages indirects</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Résiliation</h2>
              <p className="text-gray-700 mb-4">
                L'utilisateur peut résilier son compte à tout moment depuis les paramètres.
                Vidova peut résilier un compte en cas de violation des CGU, après préavis par email.
                En cas de résiliation, les données sont supprimées dans un délai de 30 jours,
                sauf obligation légale de conservation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Modifications des CGU</h2>
              <p className="text-gray-700">
                Vidova se réserve le droit de modifier les présentes CGU à tout moment.
                Les modifications sont notifiées par email 30 jours avant leur entrée en vigueur.
                L'utilisation continue du service après cette date vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Droit applicable et juridiction</h2>
              <p className="text-gray-700">
                Les présentes CGU sont soumises au droit français.
                En cas de litige, les tribunaux français seront seuls compétents.
                Une tentative de conciliation sera privilégiée avant toute action judiciaire.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact et support</h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant les CGU :
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Email :</strong> legal@vidova.me</li>
                <li><strong>Support :</strong> support@vidova.me</li>
                <li><strong>Site web :</strong> https://vidova.me</li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Consentement :</strong> En utilisant Vidova, vous reconnaissez avoir lu, compris et accepté l'ensemble des présentes Conditions Générales d'Utilisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
