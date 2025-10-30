'use client';

import Link from 'next/link';
import { ArrowLeft, Video, Mail, MessageCircle } from 'lucide-react';

export default function ContactPage() {
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
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 font-light mb-16 leading-relaxed">
            Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-gray-200">
                <Mail className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Envoyez-nous un email et nous vous répondrons dans les plus brefs délais
              </p>
              <a
                href="mailto:contact.vidova@gmail.com"
                className="text-sm text-gray-900 hover:underline font-medium"
              >
                contact.vidova@gmail.com
              </a>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-gray-200">
                <MessageCircle className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Support</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Consultez notre page d'aide pour trouver des réponses rapides
              </p>
              <Link
                href="/help"
                className="text-sm text-gray-900 hover:underline font-medium"
              >
                Centre d'aide
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  placeholder="Votre message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
