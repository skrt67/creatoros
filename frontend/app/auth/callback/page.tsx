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
          console.log('Session user:', session.user);
          console.log('Backend token from session:', (session.user as any).backendToken);

          let accessToken = (session.user as any).backendToken;

          // Si pas de token dans la session, appeler le backend
          if (!accessToken) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

            console.log('No token in session, calling backend...');

            const googleId = (session.user as any).googleId || session.user.email;
            const userName = session.user.name || session.user.email.split('@')[0];

            // Récupérer le token depuis le backend avec POST + JSON body
            const response = await fetch(
              `${apiUrl}/auth/google`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: session.user.email,
                  name: userName,
                  google_id: googleId,
                  image: session.user.image
                })
              }
            );

            console.log('Backend response status:', response.status);

            if (response.ok) {
              const result = await response.json();
              console.log('Backend response:', result);
              // Backend returns APIResponse with data.access_token structure
              accessToken = result.data?.access_token || result.access_token;
            } else {
              const errorText = await response.text();
              console.error('Backend error:', errorText);
            }
          }

          // Stocker le token dans les cookies
          if (accessToken) {
            Cookies.set('access_token', accessToken, {
              expires: 7,
              sameSite: 'lax',
              secure: window.location.protocol === 'https:',
              path: '/'
            });

            // Vérifier que le cookie est bien défini
            console.log('Cookie set, value:', Cookies.get('access_token'));

            // Attendre un peu pour être sûr que le cookie est propagé
            await new Promise(resolve => setTimeout(resolve, 500));

            // Rediriger vers le dashboard
            window.location.replace('/dashboard');
          } else {
            console.error('No access token available');
            router.push('/login');
          }
        } catch (error) {
          console.error('Error in callback:', error);
          // Rediriger vers login en cas d'erreur
          router.push('/login');
        }
      } else if (status === 'unauthenticated') {
        // Pas authentifié, rediriger vers login
        router.push('/login');
      }
    };

    handleCallback();
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-light text-gray-900 tracking-tight">Connexion en cours</h2>
      </div>
    </div>
  );
}
