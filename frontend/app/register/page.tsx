'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft, Sparkles, Video, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        const error = await response.json();
        let errorMessage = 'Une erreur est survenue';

        if (error.detail) {
          if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else if (Array.isArray(error.detail)) {
            errorMessage = error.detail.map((err: any) => err.msg).join(', ');
          }
        }

        toast.error(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/auth/callback',
        redirect: true
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Erreur lors de la connexion Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Retour</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-gray-600">Commencez gratuitement dès aujourd'hui</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="Jean Dupont"
                  required
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400`}
                  placeholder="vous@exemple.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 pr-12`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">Minimum 8 caractères</p>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600">
                  En créant un compte, vous acceptez nos{' '}
                  <Link href="/legal/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                    Conditions d'utilisation
                  </Link>{' '}
                  et notre{' '}
                  <Link href="/legal/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                    Politique de confidentialité
                  </Link>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Création...
                  </span>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full px-6 py-3 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* Benefits */}
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-purple-900 mb-3">Inclus dans le plan gratuit :</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-800">
                  <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>3 vidéos gratuites par mois</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-800">
                  <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Transcriptions automatiques</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-800">
                  <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Génération de contenu IA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
