'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, Briefcase, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Notre équipe vous répond sous 24h',
      value: 'contact@creatoros.com',
      link: 'mailto:contact@creatoros.com'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      description: 'Lun-Ven, 9h-18h',
      value: '+33 1 23 45 67 89',
      link: 'tel:+33123456789'
    },
    {
      icon: MapPin,
      title: 'Bureau',
      description: 'Venez nous rendre visite',
      value: '123 Avenue des Champs-Élysées, 75008 Paris',
      link: 'https://maps.google.com'
    },
  ];

  const subjects = [
    { value: 'general', label: 'Question générale', icon: MessageSquare },
    { value: 'support', label: 'Support technique', icon: HelpCircle },
    { value: 'sales', label: 'Ventes & Tarifs', icon: Briefcase },
    { value: 'partnership', label: 'Partenariat', icon: Zap },
  ];

  const faqs = [
    {
      question: 'Quel est le temps de réponse moyen ?',
      answer: 'Nous répondons généralement sous 24h ouvrées. Pour les questions urgentes, utilisez le chat en direct sur l\'application.'
    },
    {
      question: 'Comment puis-je obtenir une démo ?',
      answer: 'Vous pouvez essayer CreatorOS gratuitement ou nous contacter pour une démonstration personnalisée.'
    },
    {
      question: 'Proposez-vous un support en français ?',
      answer: 'Oui, notre équipe support parle français et anglais et est disponible pour vous aider.'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.');
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Nous Sommes Là Pour Vous
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link}
                      target={method.icon === MapPin ? '_blank' : undefined}
                      rel={method.icon === MapPin ? 'noopener noreferrer' : undefined}
                      className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group border-2 border-gray-200 hover:border-primary-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                          <p className="text-primary-600 font-semibold text-sm break-words">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Questions Fréquentes</h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold mt-6 hover:gap-3 transition-all"
              >
                <span>Centre d'aide complet</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-black text-gray-900 mb-8">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="john@exemple.com"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {subjects.map((subject) => {
                      const Icon = subject.icon;
                      return (
                        <label
                          key={subject.value}
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.subject === subject.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="subject"
                            value={subject.value}
                            checked={formData.subject === subject.value}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="sr-only"
                          />
                          <Icon className={`h-5 w-5 ${
                            formData.subject === subject.value ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-semibold ${
                            formData.subject === subject.value ? 'text-primary-900' : 'text-gray-700'
                          }`}>
                            {subject.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Décrivez votre demande..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  En soumettant ce formulaire, vous acceptez notre{' '}
                  <Link href="/legal/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
                    politique de confidentialité
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Additional Help */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">
            Besoin d'aide immédiate ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Consultez notre centre d'aide ou rejoignez notre communauté
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Centre d'aide</span>
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border-2 border-gray-300 hover:border-primary-500 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Communauté Discord</span>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
