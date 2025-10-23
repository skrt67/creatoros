'use client';

import { useState, useEffect } from 'react';
import { Clock, Download, FileText, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface VideoProgressTrackerProps {
  videoId: string;
  status: string;
  onStatusChange?: (status: string) => void;
}

interface ProcessingStep {
  id: number;
  label: string;
  description: string;
  icon: any;
  progress: number;
  status: 'pending' | 'active' | 'completed';
}

export function VideoProgressTracker({ videoId, status, onStatusChange }: VideoProgressTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const steps: ProcessingStep[] = [
    {
      id: 1,
      label: 'Téléchargement audio',
      description: 'Extraction de l\'audio de la vidéo YouTube',
      icon: Download,
      progress: 25,
      status: currentStep >= 1 ? 'completed' : currentStep === 0 ? 'active' : 'pending'
    },
    {
      id: 2,
      label: 'Transcription',
      description: 'Conversion de l\'audio en texte avec IA',
      icon: FileText,
      progress: 50,
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    },
    {
      id: 3,
      label: 'Analyse IA',
      description: 'Analyse du contenu et identification des moments clés',
      icon: Sparkles,
      progress: 75,
      status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    },
    {
      id: 4,
      label: 'Génération de contenu',
      description: 'Création des articles, posts et résumés',
      icon: Sparkles,
      progress: 100,
      status: currentStep >= 4 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    }
  ];

  // Fetch real progress from API avec auto-login
  const fetchProgress = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      let token = localStorage.getItem('auth_token');

      // Si pas de token, essayer de se connecter
      if (!token) {
        const loginResponse = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@creatoros.com', password: 'demo123456' })
        });
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          const newToken = loginData.access_token;
          if (newToken && typeof newToken === 'string') {
            token = newToken;
            localStorage.setItem('auth_token', newToken);
          } else {
            console.error('No token received');
            return;
          }
        } else {
          console.error('Login failed');
          return;
        }
      }

      const response = await fetch(`${apiUrl}/videos/${videoId}/progress`, {
        headers: { 'Authorization': `Bearer ${token || ''}` }
      });

      // Si 401, se reconnecter et réessayer
      if (response.status === 401) {
        const loginResponse = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@creatoros.com', password: 'demo123456' })
        });
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          const newToken = loginData.access_token;
          if (newToken && typeof newToken === 'string') {
            token = newToken;
            localStorage.setItem('auth_token', newToken);
            
            // Réessayer
            const retryResponse = await fetch(`${apiUrl}/videos/${videoId}/progress`, {
              headers: { 'Authorization': `Bearer ${newToken}` }
            });
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setCurrentStep(data.step || 0);
              setProgress(data.progress || 0);
              if (data.status === 'COMPLETED' && onStatusChange) {
                onStatusChange('COMPLETED');
              }
            }
          }
        }
      } else if (response.ok) {
        const data = await response.json();
        
        // Mettre à jour avec les données réelles de l'API
        setCurrentStep(data.step || 0);
        setProgress(data.progress || 0);
        
        // Si le statut a changé à COMPLETED, notifier le parent
        if (data.status === 'COMPLETED' && onStatusChange) {
          onStatusChange('COMPLETED');
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Polling de l'API réelle uniquement
  useEffect(() => {
    if (status === 'processing' || status === 'PROCESSING') {
      // Timer pour temps écoulé
      const timerInterval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      // Polling de l'API toutes les 3 secondes pour affichage temps réel
      const apiInterval = setInterval(fetchProgress, 3000);
      
      // Premier fetch immédiat
      fetchProgress();

      return () => {
        clearInterval(timerInterval);
        clearInterval(apiInterval);
      };
    }
  }, [status, videoId]);

  if (status !== 'processing' && status !== 'PROCESSING') {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeStep = steps.find(step => step.status === 'active');
  const completedSteps = steps.filter(step => step.status === 'completed').length;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-primary-300 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Traitement en cours...</h3>
            <p className="text-sm text-gray-600">
              Étape {completedSteps + 1}/4 • {formatTime(elapsedTime)} écoulé
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </p>
          <p className="text-xs text-gray-500 font-medium">Progression</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Active Step Details */}
      {activeStep && (
        <div className="mb-6 p-4 bg-white rounded-xl border-2 border-primary-200 animate-pulse-slow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg">
              <activeStep.icon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-1">{activeStep.label}</p>
              <p className="text-sm text-gray-600">{activeStep.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
              <span className="text-xs font-semibold text-primary-600">En cours</span>
            </div>
          </div>
        </div>
      )}

      {/* Steps Timeline */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const isPending = step.status === 'pending';

          return (
            <div 
              key={step.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary-50 border border-primary-200' 
                  : isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 opacity-60'
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500' 
                  : isActive
                  ? 'bg-gradient-to-br from-primary-500 to-purple-500'
                  : 'bg-gray-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : isActive ? (
                  <StepIcon className="h-5 w-5 text-white animate-pulse" />
                ) : (
                  <StepIcon className="h-5 w-5 text-white opacity-50" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  isCompleted ? 'text-green-700' : isActive ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  Étape {step.id}/4 : {step.label}
                </p>
                <p className="text-xs text-gray-600 truncate">{step.description}</p>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <CheckCircle className="h-3 w-3" />
                    Terminé
                  </span>
                )}
                {isActive && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    {Math.round(step.progress)}%
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                    <Clock className="h-3 w-3" />
                    En attente
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimation */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Temps restant estimé:</span>
          <span className="font-bold text-gray-900">
            ~{Math.max(0, Math.ceil((100 - progress) / 5))} minutes
          </span>
        </div>
      </div>

      {/* Info */}
      <p className="mt-4 text-xs text-center text-gray-500">
        ℹ️ Vous serez notifié lorsque votre contenu sera prêt
      </p>
    </div>
  );
}
