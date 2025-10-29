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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Email envoyé !</h2>
            <p className="text-gray-600">
              Si un compte existe avec <strong>{email}</strong>, vous recevrez un email avec les instructions.
            </p>
          </div>
          
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Mot de passe oublié ?</h1>
            <p className="text-gray-600">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                placeholder="votre@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le lien'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-gray-900 hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
