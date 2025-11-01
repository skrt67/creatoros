'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import Cookies from 'js-cookie';

export function Sidebar() {
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
          onClick={() => router.push('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          <Settings className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-medium">Paramètres</span>
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
