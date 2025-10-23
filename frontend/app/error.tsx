'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4 animate-bounce-subtle">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oups ! Une erreur s'est produite
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-4">
            Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer.
          </p>
          
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                Détails techniques (développement uniquement)
              </summary>
              <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-auto max-h-40">
                <p className="text-red-600 font-semibold mb-2">Error:</p>
                <p>{error.message}</p>
                {error.digest && (
                  <p className="mt-2 text-gray-600">
                    <span className="font-semibold">Digest:</span> {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Réessayer
          </button>
          
          <Link href="/" className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-gray-500">
            Si le problème persiste, veuillez{' '}
            <Link href="/help" className="text-primary-600 hover:text-primary-700 hover:underline">
              contacter le support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
