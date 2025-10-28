'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

const articles: Record<string, any> = {
  '1': { title: 'Comment l\'IA transforme la création de contenu en 2025', category: 'IA & Technologie', date: '2025-01-15', readTime: '8 min', author: 'Marie Laurent', image: '🤖' },
  '2': { title: '10 astuces pour optimiser vos transcriptions vidéo', category: 'Guide pratique', date: '2025-01-12', readTime: '5 min', author: 'Thomas Martin', image: '📝' },
  '3': { title: 'Automatiser votre stratégie de contenu avec Vidova', category: 'Productivité', date: '2025-01-10', readTime: '6 min', author: 'Sophie Bernard', image: '⚡' },
  '4': { title: 'Les secrets des créateurs qui cartonnent sur TikTok', category: 'Social Media', date: '2025-01-08', readTime: '7 min', author: 'Jean Dupont', image: '🎥' },
  '5': { title: 'Comment générer des articles de blog à partir de vidéos', category: 'SEO & Content', date: '2025-01-05', readTime: '5 min', author: 'Marie Laurent', image: '📰' },
  '6': { title: 'L\'avenir du marketing de contenu', category: 'Marketing', date: '2025-01-03', readTime: '9 min', author: 'Sophie Bernard', image: '🚀' },
  '7': { title: 'Créer des threads Twitter viraux depuis vos vidéos', category: 'Social Media', date: '2024-12-28', readTime: '6 min', author: 'Thomas Martin', image: '🐦' }
};

export default function BlogPostPage() {
  const params = useParams();
  const post = articles[params.id as string];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Article non trouvé</h1>
          <Link href="/blog" className="text-primary-600">← Retour au blog</Link>
        </div>
      </div>
    );
  }

  const content = `
    <p class="lead">Cet article explore en profondeur ${post.title.toLowerCase()}. Découvrez des insights pratiques et actionnables pour améliorer votre stratégie de contenu.</p>
    
    <h2>Introduction</h2>
    <p>Dans le paysage digital en constante évolution, comprendre et maîtriser les nouvelles tendances est essentiel pour rester compétitif.</p>
    
    <h2>Les points clés</h2>
    <ul>
      <li><strong>Innovation :</strong> Les dernières technologies et méthodologies</li>
      <li><strong>Stratégie :</strong> Comment appliquer ces concepts à votre business</li>
      <li><strong>Résultats :</strong> Les métriques et KPIs à suivre</li>
      <li><strong>Best practices :</strong> Les erreurs à éviter et les tactiques gagnantes</li>
    </ul>
    
    <h2>Mise en pratique</h2>
    <p>Voici comment vous pouvez commencer dès aujourd'hui :</p>
    <ol>
      <li>Analysez votre situation actuelle et identifiez les opportunités</li>
      <li>Définissez des objectifs clairs et mesurables</li>
      <li>Mettez en place les outils et processus nécessaires</li>
      <li>Testez, mesurez et optimisez en continu</li>
    </ol>
    
    <h2>Études de cas</h2>
    <p>De nombreux créateurs et entreprises ont déjà adopté ces stratégies avec succès, générant des résultats impressionnants en termes d'engagement, de reach et de conversions.</p>
    
    <h2>Conclusion</h2>
    <p>En appliquant ces principes, vous serez en mesure de transformer votre approche et d'obtenir des résultats concrets. N'attendez plus pour passer à l'action !</p>
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 font-semibold">
            <ArrowLeft className="h-4 w-4" /> Retour au blog
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
            <Share2 className="h-4 w-4" /> Partager
          </button>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-bold rounded-full">{post.category}</span>
            <span className="text-6xl">{post.image}</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">{post.title}</h1>
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {new Date(post.date).toLocaleDateString('fr-FR')}</div>
            <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> {post.readTime}</div>
            <div>Par {post.author}</div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

        <footer className="mt-16 pt-8 border-t">
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Prêt à transformer vos vidéos en contenu ?</h3>
            <p className="mb-6">Rejoignez des milliers de créateurs qui utilisent Vidova</p>
            <Link href="/register" className="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100">
              Commencer gratuitement
            </Link>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
}
