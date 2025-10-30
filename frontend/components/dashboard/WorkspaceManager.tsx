'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Folder, Plus, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';

interface Workspace {
  id: string;
  name: string;
  created_at?: string;
  createdAt?: string;
}

interface WorkspaceManagerProps {
  onWorkspaceChange: (workspaceId: string) => void;
  currentWorkspaceId: string | null;
  onWorkspaceCreated?: () => void;
}

export function WorkspaceManager({ onWorkspaceChange, currentWorkspaceId, onWorkspaceCreated }: WorkspaceManagerProps) {
  const { t } = useLanguage();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Récupérer la liste des workspaces
  const fetchWorkspaces = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/workspaces`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    }
  };

  // Charger les workspaces au montage
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWorkspaceName.trim()) {
      toast.error('Le nom du workspace est requis');
      return;
    }

    setIsCreating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newWorkspaceName })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Workspace créé avec succès ! 🎉');
        setNewWorkspaceName('');
        setShowCreateForm(false);
        
        // Rafraîchir la liste des workspaces
        if (onWorkspaceCreated) {
          onWorkspaceCreated();
        }
        
        // Récupérer les workspaces mis à jour
        await fetchWorkspaces();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Erreur lors de la création';
        toast.error(errorMessage);
        console.error('Workspace creation error:', errorData);
      }
    } catch (error: any) {
      console.error('Workspace creation error:', error);
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">{t('myWorkspaces')}</h3>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>{t('create')}</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200 animate-slide-down">
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du workspace
              </label>
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Mon nouveau workspace"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isCreating}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{t('createWorkspace')}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-300 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workspaces List */}
      <div className="p-4">
        {workspaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">{t('noWorkspace')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('createOneToStart')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {workspaces.map((workspace) => {
              const isActive = workspace.id === currentWorkspaceId;
              const createdDate = new Date(workspace.created_at || workspace.createdAt || Date.now());
              
              return (
                <button
                  key={workspace.id}
                  onClick={() => onWorkspaceChange(workspace.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-purple-50 border-primary-500 shadow-md'
                      : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-lg ${
                        isActive 
                          ? 'bg-gradient-to-br from-primary-600 to-purple-600' 
                          : 'bg-gray-100 group-hover:bg-primary-100'
                      } transition-all`}>
                        <Folder className={`h-5 w-5 ${
                          isActive ? 'text-white' : 'text-gray-600 group-hover:text-primary-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-lg truncate ${
                          isActive ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {workspace.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Créé: {createdDate.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                        <Check className="h-3 w-3" />
                        <span>Actif</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
