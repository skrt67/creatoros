'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui';
import { Save, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContentPreferences {
  writing_style: string;
  content_length: string;
  tone: string;
}

export default function ContentSettingsPage() {
  const [preferences, setPreferences] = useState<ContentPreferences>({
    writing_style: 'BALANCED',
    content_length: 'MEDIUM',
    tone: 'FRIENDLY'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences({
          writing_style: data.writing_style,
          content_length: data.content_length,
          tone: data.tone
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        toast.success('Préférences sauvegardées !');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres de Contenu</h1>
        <p className="text-gray-600">
          Personnalisez le style et le ton des contenus générés par l'IA
        </p>
      </div>

      <div className="space-y-6">
        {/* Style d'écriture */}
        <Card>
          <CardHeader>
            <CardTitle>Style d'écriture</CardTitle>
            <CardDescription>
              Choisissez le style d'écriture pour vos contenus générés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { value: 'FORMAL', label: 'Formel', desc: 'Professionnel et structuré' },
                { value: 'CASUAL', label: 'Décontracté', desc: 'Léger et accessible' },
                { value: 'BALANCED', label: 'Équilibré', desc: 'Mix entre formel et décontracté' },
                { value: 'PROFESSIONAL', label: 'Professionnel', desc: 'Business et sérieux' },
                { value: 'CREATIVE', label: 'Créatif', desc: 'Original et engageant' },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => setPreferences({ ...preferences, writing_style: style.value })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    preferences.writing_style === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{style.label}</div>
                  <div className="text-sm text-gray-600">{style.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Longueur du contenu */}
        <Card>
          <CardHeader>
            <CardTitle>Longueur du contenu</CardTitle>
            <CardDescription>
              Définissez la longueur préférée pour vos contenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'SHORT', label: 'Court', desc: '300-500 mots' },
                { value: 'MEDIUM', label: 'Moyen', desc: '700-1000 mots' },
                { value: 'LONG', label: 'Long', desc: '1200-1500 mots' },
              ].map((length) => (
                <button
                  key={length.value}
                  onClick={() => setPreferences({ ...preferences, content_length: length.value })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    preferences.content_length === length.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{length.label}</div>
                  <div className="text-sm text-gray-600">{length.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ton */}
        <Card>
          <CardHeader>
            <CardTitle>Ton général</CardTitle>
            <CardDescription>
              Sélectionnez le ton émotionnel de vos contenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { value: 'FRIENDLY', label: 'Amical', desc: 'Chaleureux et proche' },
                { value: 'PROFESSIONAL', label: 'Professionnel', desc: 'Sérieux et expert' },
                { value: 'INSPIRATIONAL', label: 'Inspirant', desc: 'Motivant et positif' },
                { value: 'HUMOROUS', label: 'Humoristique', desc: 'Léger et amusant' },
                { value: 'SERIOUS', label: 'Sérieux', desc: 'Factuel et direct' },
              ].map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setPreferences({ ...preferences, tone: tone.value })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    preferences.tone === tone.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{tone.label}</div>
                  <div className="text-sm text-gray-600">{tone.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder les préférences
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
