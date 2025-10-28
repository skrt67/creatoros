'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export default function SimpleDashboard() {
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        
        // Check if we have a token
        let token = localStorage.getItem('auth_token');
        
        if (!token) {
          // Try to login with demo credentials
          const loginResponse = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'demo@creatoros.com',
              password: 'demo123'
            })
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.access_token;
            if (token) localStorage.setItem('auth_token', token);
          } else {
            throw new Error('Login failed');
          }
        }
        
        // Get user info
        const userResponse = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        
        // Get workspaces
        const workspacesResponse = await fetch(`${apiUrl}/workspaces`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (workspacesResponse.ok) {
          const workspacesData = await workspacesResponse.json();
          setWorkspaces(workspacesData);
        } else {
          throw new Error(`Failed to fetch workspaces: ${workspacesResponse.status}`);
        }
        
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        // Redirect to login if auth fails
        if (err.message?.includes('401') || err.message?.includes('Login failed')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Vidova Dashboard</h1>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-gray-600">Welcome, {user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Workspaces</h2>
          
          {workspaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No workspaces found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {workspace.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(workspace.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Open Workspace
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
