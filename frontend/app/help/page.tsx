'use client';

import Link from 'next/link';
import { ArrowLeft, Video, MessageCircle, Mail } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: "Comment ajouter une vidéo YouTube ?",
      answer: "Collez simplement l'URL de votre vidéo YouTube dans le dashboard. Notre IA se charge du reste."
    },
    {
      question: "Combien de vidéos puis-je traiter gratuitement ?",
      answer: "Le plan gratuit inclut 3 vidéos par mois. Pour un usage illimité, consultez nos tarifs."
    },
    {
      question: "Combien de temps prend le traitement ?",
      answer: "Le traitement d'une vidéo prend généralement entre 5 et 15 minutes selon sa durée."
    },
    {
      question: "Puis-je modifier le contenu généré ?",
      answer: "Oui, tout le contenu généré est éditable et téléchargeable dans différents formats."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte."
    }
  ];

  const quickStart = [
    {
      number: '1',
      title: 'Créez votre compte',
      description: 'Inscrivez-vous gratuitement en quelques secondes'
    },
    {
      number: '2',
      title: 'Ajoutez une vidéo',
      description: 'Collez l\'URL de votre vidéo YouTube'
    },
    {
      number: '3',
      title: 'Laissez l\'IA travailler',
      description: 'Notre IA analyse et génère du contenu'
    },
    {
      number: '4',
      title: 'Téléchargez',
      description: 'Récupérez votre contenu prêt à publier'
    }
  ];

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Centre d'aide
          </h1>
          <p className="text-xl text-gray-600 font-light mb-16 leading-relaxed">
            Trouvez rapidement des réponses à vos questions
          </p>

          {/* Quick Start */}
          <div className="mb-20">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">Démarrage rapide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStart.map((step) => (
                <div key={step.number} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4 text-lg font-medium">
                    {step.number}
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 font-light">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200/60 mb-20"></div>

          {/* FAQ */}
          <div className="mb-20">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">Questions fréquentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-base text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200/60 mb-20"></div>

          {/* Contact Support */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Besoin d'aide supplémentaire ?</h2>
            <p className="text-base text-gray-600 font-light mb-8 leading-relaxed">
              Notre équipe de support est là pour vous aider. Contactez-nous par email ou consultez notre documentation.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="mailto:contact.vidova@gmail.com"
                className="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Envoyer un email</span>
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-3 px-6 py-4 border border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Contactez-nous</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
