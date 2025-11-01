'use client';

import { useState, useEffect } from 'react';
import { Video, Zap, Crown, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

interface UsageInfo {
  plan: string;
  videosProcessed: number;
  limit: number;
  videosRemaining: number;
  canProcess: boolean;
  month: string;
  isUnlimited: boolean;
  totalVideosAllTime: number;
}

export function UsageCounter() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/usage/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const percentage = usage.isUnlimited ? 100 : (usage.videosProcessed / usage.limit) * 100;
  const isNearLimit = !usage.isUnlimited && usage.videosRemaining <= 1;
  const isAtLimit = !usage.canProcess;

  const getPlanBadge = () => {
    if (usage.plan === 'PRO') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
          <Crown className="h-4 w-4" />
          Pro
        </div>
      );
    } else if (usage.plan === 'ENTERPRISE') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-sm font-bold">
          <Zap className="h-4 w-4" />
          Enterprise
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Gratuit
        </div>
      );
    }
  };

  return (
    <div className={`rounded-xl border p-6 ${
      isAtLimit
        ? 'bg-red-50 border-red-200'
        : isNearLimit
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Utilisation mensuelle</h3>
          </div>
          <p className="text-sm text-gray-600">
            {new Date(usage.month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {getPlanBadge()}
      </div>

      {usage.isUnlimited ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-black text-gray-900">
              {usage.videosProcessed}
            </span>
            <span className="text-sm font-medium text-gray-600">vidéos traitées</span>
          </div>
          <p className="text-sm text-green-600 font-medium">✨ Illimité</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-black text-gray-900">
              {usage.videosProcessed} / {usage.limit}
            </span>
            <span className="text-sm font-medium text-gray-600">vidéos utilisées</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isAtLimit
                    ? 'bg-red-500'
                    : isNearLimit
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {isAtLimit ? (
            <div className="flex items-start gap-2 p-3 bg-red-100 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">Limite atteinte !</p>
                <p className="text-xs text-red-700 mt-1">
                  Passez à Pro pour un accès illimité
                </p>
              </div>
            </div>
          ) : isNearLimit ? (
            <div className="flex items-start gap-2 p-3 bg-orange-100 rounded-lg border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Plus que {usage.videosRemaining} vidéo{usage.videosRemaining > 1 ? 's' : ''} !
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Pensez à passer à Pro pour continuer
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              {usage.videosRemaining} vidéo{usage.videosRemaining > 1 ? 's' : ''} restante{usage.videosRemaining > 1 ? 's' : ''} ce mois
            </p>
          )}
        </div>
      )}

      {usage.plan === 'FREE' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => window.location.href = '/pricing'}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
          >
            <Crown className="h-4 w-4" />
            Passer à Pro - Illimité
          </button>
        </div>
      )}
    </div>
  );
}
