'use client';

import { Loader2, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl shadow-lg mb-4 animate-bounce-subtle">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
        </div>

        {/* Loading Text */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chargement en cours...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter un instant
          </p>
        </div>

        {/* Progress Dots */}
        <div className="mt-8 flex justify-center space-x-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
