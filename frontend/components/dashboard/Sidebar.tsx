'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Youtube,
  Instagram,
  Twitter,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react';
import Cookies from 'js-cookie';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      name: 'Vidéos',
      icon: Video,
      path: '/dashboard/videos',
      active: pathname === '/dashboard/videos'
    },
    {
      name: 'TikTok Stats',
      icon: TrendingUp,
      path: '/dashboard/tiktok',
      active: pathname === '/dashboard/tiktok',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      path: '/dashboard/youtube',
      active: pathname === '/dashboard/youtube'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      path: '/dashboard/instagram',
      active: pathname === '/dashboard/instagram'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      path: '/dashboard/twitter',
      active: pathname === '/dashboard/twitter'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Vidova</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {userName ? userName.charAt(0).toUpperCase() : userEmail?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {userName || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
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
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                  ${item.gradient && item.active ? `bg-gradient-to-r ${item.gradient}` : ''}
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
      <div className="p-3 border-t border-gray-800 space-y-1">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
        >
          <Settings className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">Paramètres</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
