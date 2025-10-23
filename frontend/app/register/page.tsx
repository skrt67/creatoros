'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Zap, ArrowLeft, Sparkles, Mail, Lock, User, CheckCircle } from 'lucide-react';

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
    
    // Validation côté client
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Ajouter workspace_name automatiquement basé sur le nom de l'utilisateur
      const registrationData = {
        email: formData.email,
        password: formData.password,
        workspace_name: formData.name ? `Workspace de ${formData.name}` : 'Mon Workspace'
      };
      
      const response = await fetch('http://localhost:8003/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        toast.success('Compte créé avec succès ! 🎉');
        router.push('/login');
      } else {
        const error = await response.json();
        
        // Gérer les erreurs de validation Pydantic
        let errorMessage = 'Erreur lors de la création du compte';
        
        if (error.detail) {
          if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else if (Array.isArray(error.detail)) {
            // Erreurs de validation Pydantic
            errorMessage = error.detail.map((err: any) => err.msg).join(', ');
          }
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Back Button */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à l'accueil</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">CreatorOS</h1>
              <p className="text-white/80 text-sm">AI Content Studio</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Rejoignez des milliers<br />de créateurs à succès
            </h2>
            <p className="text-lg text-white/90">
              Commencez à transformer vos vidéos en contenu viral dès aujourd'hui avec la puissance de l'IA.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 pt-4">
            {[
              'Essai gratuit sans carte bancaire',
              'Support prioritaire 24/7',
              'Accès à toutes les fonctionnalités',
              'Annulation à tout moment'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 CreatorOS. Tous droits réservés.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Link>
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">CreatorOS</h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Créez votre compte</h2>
            <p className="mt-2 text-gray-600">Commencez à créer du contenu incroyable</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900`}
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900`}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900`}
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
              {errors.password ? (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Minimum 8 caractères
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
                  politique de confidentialité
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 lg:bg-transparent text-gray-500 font-medium">OU</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
