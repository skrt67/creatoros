'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Calendar,
  Settings,
  LogOut,
  Crown
} from 'lucide-react';
import Cookies from 'js-cookie';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [subscriptionPlan, setSubscriptionPlan] = useState<'FREE' | 'PRO'>('FREE');

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vidova.me';
      const token = Cookies.get('access_token');

      if (!token) return;

      const response = await fetch(`${apiUrl}/billing/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionPlan(data.plan || 'FREE');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      name: 'Calendrier',
      icon: Calendar,
      path: '/dashboard/calendar',
      active: pathname === '/dashboard/calendar'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200/60 flex flex-col z-50">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-medium tracking-tight text-gray-900">Vidova</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-900">
              {userName ? userName.charAt(0).toUpperCase() : userEmail?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName || 'User'}
              </p>
              {subscriptionPlan === 'PRO' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full">
                  <Crown className="h-3 w-3" />
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${item.active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200/60 space-y-1">
        <button
          onClick={() => router.push('/settings/subscription')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          <Settings className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">Abonnement</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
