'use client';

import Link from 'next/link';
import { Zap, Mail, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

export function Footer() {
  const navigation = {
    product: [
      { name: 'Fonctionnalités', href: '/#features' },
      { name: 'Tarifs', href: '/billing' },
      { name: 'Documentation', href: '/help' },
      { name: 'Changelog', href: '#' },
    ],
    company: [
      { name: 'À propos', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Carrières', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Confidentialité', href: '/legal/privacy' },
      { name: 'Conditions d\'utilisation', href: '/legal/terms' },
      { name: 'Mentions légales', href: '/legal/mentions' },
    ],
    social: [
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
      { name: 'GitHub', icon: Github, href: '#' },
      { name: 'YouTube', icon: Youtube, href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-10 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-purple-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white">CreatorOS</span>
                <p className="text-xs text-gray-400">AI Content Studio</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Transformez vos vidéos YouTube en contenu viral avec la puissance de l'IA. Rejoignez des milliers de créateurs.
            </p>
            <div className="flex gap-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4">Produit</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-4">Légal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 CreatorOS. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Statut
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                API
              </Link>
              <Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
