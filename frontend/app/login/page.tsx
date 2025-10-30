'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Zap, ArrowLeft, Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@creatoros.com',
    password: 'password'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.access_token);
        toast.success('Bienvenue ! 👋');
        router.push('/dashboard');
      } else {
        const error = await response.json();
        
        // Gérer les erreurs de validation Pydantic
        let errorMessage = 'Email ou mot de passe incorrect';
        
        if (error.detail) {
          if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else if (Array.isArray(error.detail)) {
            errorMessage = error.detail.map((err: any) => err.msg).join(', ');
          }
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Duna Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-orange-200 via-yellow-100 to-green-100 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-300 to-transparent rounded-t-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-t from-purple-200 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Transformez vos vidéos
          </h2>
          <p className="text-lg text-gray-700">
            en contenu viral avec l'IA
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Retour</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Connexion</h1>
            <p className="text-gray-600">Accédez à votre espace créateur</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full px-6 py-3 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t border-gray-200 mt-8">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-medium text-gray-900 hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 text-center">
              <span className="font-medium">💡 Compte démo pré-rempli</span>
              <br />
              <span className="text-blue-700">Cliquez sur "Se connecter" pour tester</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
