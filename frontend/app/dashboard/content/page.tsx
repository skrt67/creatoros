'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Retour</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contenu Généré</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun contenu</h2>
          <p className="text-gray-600 mb-6">Votre contenu généré apparaîtra ici</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Aller au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
