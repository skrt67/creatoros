'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Email de réinitialisation envoyé !');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error('Impossible de contacter le serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email envoyé !
            </h2>
            
            <p className="text-gray-600 mb-8">
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email 
              avec les instructions pour réinitialiser votre mot de passe.
            </p>
            
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/login"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la connexion
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Envoyer le lien
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
