'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 animate-gradient">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-primary-100 rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="absolute inset-8 bg-primary-200 rounded-full opacity-30 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-16 bg-primary-300 rounded-full opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-24 h-24 text-primary-600 animate-float" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/" className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto">
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Page précédente
          </button>
          
          <Link href="/help">
            <button className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors w-full sm:w-auto">
              <HelpCircle className="mr-2 h-5 w-5" />
              Besoin d'aide ?
            </button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-500 mb-4">Pages populaires :</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dashboard" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
              Connexion
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/register" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
              Inscription
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/help" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
              Aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
