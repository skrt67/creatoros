'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, User, LogOut, Settings, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/billing" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Billing
          </Link>
          <Link 
            href="/settings" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Settings
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/settings')}
              className="hidden md:flex"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
