'use client';

import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Vérifier que l'événement et la clé existent
      if (!event || !event.key || typeof event.key !== 'string') return;
      
      shortcuts.forEach((shortcut) => {
        // Vérifier que le shortcut et sa clé existent
        if (!shortcut || !shortcut.key || typeof shortcut.key !== 'string') return;
        
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [shortcuts]);
}

// Hook pour afficher les raccourcis disponibles
export function useShortcutHelp() {
  const shortcuts = [
    { key: 'N', ctrl: true, description: 'Nouvelle vidéo' },
    { key: 'K', ctrl: true, description: 'Rechercher' },
    { key: 'H', ctrl: true, description: 'Aide' },
    { key: '/', description: 'Recherche rapide' },
    { key: 'Escape', description: 'Fermer les modales' },
  ];

  return shortcuts;
}
