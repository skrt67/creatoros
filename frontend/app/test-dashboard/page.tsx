'use client';

import { useEffect, useState } from 'react';

export default function TestDashboard() {
  const [status, setStatus] = useState('Initializing...');
  const [apiUrl, setApiUrl] = useState('');
  const [loginResult, setLoginResult] = useState('');

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Testing API connection...');
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        setApiUrl(url);
        
        // Test health endpoint
        const healthResponse = await fetch(`${url}/health`);
        const healthData = await healthResponse.json();
        setStatus(`Health check: ${healthData.status}`);
        
        // Test login
        setStatus('Testing login...');
        const loginResponse = await fetch(`${url}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'demo@creatoros.com',
            password: 'demo123'
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          setLoginResult('Login successful!');
          
          // Test workspaces
          setStatus('Testing workspaces...');
          const workspacesResponse = await fetch(`${url}/workspaces`, {
            headers: {
              'Authorization': `Bearer ${loginData.access_token}`
            }
          });
          
          if (workspacesResponse.ok) {
            const workspaces = await workspacesResponse.json();
            setStatus(`Success! Found ${workspaces.length} workspace(s)`);
          } else {
            setStatus(`Workspaces error: ${workspacesResponse.status}`);
          }
        } else {
          setLoginResult(`Login failed: ${loginResponse.status}`);
          setStatus('Login failed');
        }
        
      } catch (error: any) {
        setStatus(`Error: ${error?.message || 'Unknown error'}`);
      }
    };
    
    testAPI();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CreatorOS API Test</h1>
      <div className="space-y-4">
        <div>
          <strong>API URL:</strong> {apiUrl}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Login:</strong> {loginResult}
        </div>
        <div className="mt-8">
          <a href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded">
            Go to Real Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
