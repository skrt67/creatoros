/**
 * Auto-login utility pour gérer l'authentification automatique
 */

import Cookies from 'js-cookie';

const DEMO_CREDENTIALS = {
  email: 'demo@creatoros.com',
  password: 'demo123456'
};

let isRefreshing = false;

export async function autoLogin(): Promise<string | null> {
  // Éviter les double-refresh
  if (isRefreshing) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Cookies.get('access_token');
  }

  try {
    isRefreshing = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
    
    console.log('🔄 Auto-login en cours...');
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_CREDENTIALS)
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;
      Cookies.set('access_token', token);
      console.log('✅ Auto-login réussi');
      return token;
    } else {
      console.error('❌ Auto-login échoué:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur auto-login:', error);
    return null;
  } finally {
    isRefreshing = false;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
  const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;
  
  // Essayer avec le token actuel
  let token = Cookies.get('access_token');
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  };

  let response = await fetch(fullUrl, requestOptions);

  // Si erreur 401, essayer de se reconnecter
  if (response.status === 401) {
    console.log('⚠️ Token expiré, tentative de reconnexion...');
    token = await autoLogin();
    
    if (token) {
      // Réessayer avec le nouveau token
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${token}`
      };
      response = await fetch(fullUrl, requestOptions);
    }
  }

  return response;
}

// Hook pour initialiser l'auth au chargement
export function useAutoLogin() {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('access_token');
    if (!token) {
      autoLogin();
    }
  }
}
