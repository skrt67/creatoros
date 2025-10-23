'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Video, Settings, HelpCircle, LogOut, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: 'new-video',
      label: 'Ajouter une nouvelle vidéo',
      icon: Video,
      action: () => {
        router.push('/dashboard');
        onClose();
      },
      keywords: ['video', 'nouveau', 'ajouter', 'youtube'],
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      action: () => {
        router.push('/settings');
        onClose();
      },
      keywords: ['settings', 'paramètres', 'config'],
    },
    {
      id: 'help',
      label: 'Centre d\'aide',
      icon: HelpCircle,
      action: () => {
        router.push('/help');
        onClose();
      },
      keywords: ['aide', 'help', 'support'],
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search.toLowerCase())
    ) || cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Rechercher une action... (Ctrl+K)"
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="p-2">
                {filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        index === selectedIndex
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{cmd.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Aucun résultat trouvé</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↓</kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↵</kbd>
                Sélectionner
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
