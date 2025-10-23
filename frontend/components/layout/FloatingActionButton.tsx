'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export function FloatingActionButton({ onClick, isActive = false }: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700'
      } text-white hover:scale-110 hover:shadow-3xl group`}
      aria-label={isActive ? 'Fermer' : 'Ajouter une vidéo'}
    >
      <div className="relative">
        {isActive ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
        )}
      </div>
      
      {/* Label on hover */}
      <span
        className={`font-semibold whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 overflow-hidden'
        }`}
      >
        {isActive ? 'Fermer' : 'Ajouter une Vidéo'}
      </span>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
    </button>
  );
}
