'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (status === 'loading') return;

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

          // Récupérer le token depuis le backend
          const response = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name || session.user.email.split('@')[0],
              google_id: (session.user as any).googleId,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            // Stocker le token dans les cookies
            if (data.access_token) {
              Cookies.set('access_token', data.access_token, {
                expires: 7,
                sameSite: 'lax',
                secure: window.location.protocol === 'https:'
              });
            }
          }

          // Rediriger vers le dashboard
          window.location.replace('/dashboard');
        } catch (error) {
          console.error('Error in callback:', error);
          // Rediriger quand même
          window.location.replace('/dashboard');
        }
      } else if (status === 'unauthenticated') {
        // Pas authentifié, rediriger vers login
        router.push('/login');
      }
    };

    handleCallback();
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion en cours...</h2>
        <p className="text-gray-600">Veuillez patienter</p>
      </div>
    </div>
  );
}
