# 🎨 Vidova Design System

## Vision Design
**Vidova** est une plateforme SaaS moderne, professionnelle et accessible. Le design reflète l'innovation, la simplicité et la puissance de l'IA.

---

## 🎯 Principes de Design

### 1. **Clarté & Hiérarchie**
- Information la plus importante en premier
- Hiérarchie visuelle claire avec typographie
- Espacement généreux pour la lisibilité

### 2. **Cohérence**
- Patterns répétables sur toutes les pages
- Comportements prévisibles
- Design system unifié

### 3. **Modernité**
- Gradients subtils
- Micro-animations fluides
- Glass morphism
- Ombres douces

### 4. **Performance**
- Animations optimisées GPU
- Lazy loading
- Images optimisées
- Code splitting

---

## 🎨 Palette de Couleurs

### **Couleurs Primaires**
```css
Primary Blue:
- 50:  #f0f9ff  (backgrounds)
- 100: #e0f2fe  (hover states)
- 500: #0ea5e9  (primary actions)
- 600: #0284c7  (primary hover)
- 700: #0369a1  (pressed states)

Purple Accent:
- 500: #a855f7
- 600: #9333ea

Pink Accent:
- 500: #ec4899
- 600: #db2777
```

### **Couleurs Sémantiques**
```css
Success: #22c55e (green-500)
Warning: #f59e0b (yellow-500)
Error:   #ef4444 (red-500)
Info:    #3b82f6 (blue-500)
```

### **Couleurs Neutres**
```css
Gray Scale:
- 50:  #f9fafb  (backgrounds)
- 100: #f3f4f6  (hover)
- 200: #e5e7eb  (borders)
- 500: #6b7280  (text secondary)
- 900: #111827  (text primary)
```

---

## 📐 Espacement & Layout

### **Spacing Scale**
```css
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### **Container Widths**
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px

Max-width: 1600px (dashboard)
Max-width: 1280px (pages)
```

### **Grid System**
- 12 colonnes
- Gap: 24px (1.5rem)
- Responsive breakpoints

---

## 📝 Typographie

### **Font Family**
```css
Sans: 'Inter', system-ui, sans-serif
Mono: 'JetBrains Mono', monospace
```

### **Scale Typographique**
```css
Display: 72px / 5rem    (font-black, leading-tight)
H1:      48px / 3rem    (font-bold, tracking-tight)
H2:      36px / 2.25rem (font-bold)
H3:      24px / 1.5rem  (font-semibold)
H4:      20px / 1.25rem (font-semibold)
Body:    16px / 1rem    (font-normal)
Small:   14px / 0.875rem (font-normal)
Tiny:    12px / 0.75rem  (font-medium)
```

### **Font Weights**
```css
Light:    300
Normal:   400
Medium:   500
Semibold: 600
Bold:     700
Black:    900
```

---

## 🔘 Composants

### **Boutons**

**Primary**
```tsx
className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 
          hover:from-primary-700 hover:to-purple-700 text-white 
          font-bold rounded-xl shadow-lg hover:shadow-xl 
          transition-all hover:scale-105"
```

**Secondary**
```tsx
className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 
          font-semibold rounded-xl border border-gray-200 
          shadow-md transition-all"
```

**Ghost**
```tsx
className="px-4 py-2 text-gray-600 hover:text-primary-600 
          hover:bg-primary-50 rounded-lg transition-all"
```

### **Cards**

**Standard Card**
```tsx
className="bg-white rounded-2xl shadow-sm border border-gray-200 
          overflow-hidden"
```

**Hero Card**
```tsx
className="bg-gradient-to-br from-white via-primary-50/50 to-purple-50/50 
          rounded-3xl shadow-xl border border-white/20"
```

**Glass Card**
```tsx
className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg 
          border border-gray-200/50"
```

### **Inputs**
```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-xl 
          focus:ring-2 focus:ring-primary-500 focus:border-transparent 
          transition-all"
```

---

## ✨ Animations

### **Transitions**
```css
Fast:   150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:   200ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:   300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### **Animations Personnalisées**
```css
fade-in:      opacity 0→1
fade-in-up:   opacity + translateY
scale-in:     scale 0.9→1 + opacity
slide-in:     translateX 100%→0
bounce-subtle: translateY subtle bounce
pulse:        scale + opacity loop
```

### **Hover States**
```css
Scale:  hover:scale-105
Shadow: hover:shadow-xl
Color:  hover:from-primary-700
```

---

## 🎭 Patterns de Page

### **Structure Standard**
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
  <Header />
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <Hero />
    <Content />
  </main>
  <Footer />
</div>
```

### **Hero Section**
```tsx
<div className="relative">
  <div className="absolute blur gradient background" />
  <div className="relative bg-gradient-to-br rounded-3xl shadow-xl">
    <Badge />
    <Heading />
    <Description />
    <CTAs />
  </div>
</div>
```

---

## 🌈 Gradients

### **Backgrounds**
```css
Page:    from-gray-50 via-blue-50/30 to-purple-50/20
Hero:    from-white via-primary-50/50 to-purple-50/50
Accent:  from-primary-600 via-purple-600 to-pink-600
```

### **Buttons**
```css
Primary: from-primary-600 to-purple-600
Success: from-green-500 to-emerald-600
Error:   from-red-500 to-pink-500
```

### **Text**
```css
Gradient Text: from-gray-900 via-primary-600 to-purple-600
Highlight:     from-primary-600 via-purple-600 to-pink-600
```

---

## 📱 Responsive Design

### **Breakpoints**
```css
sm:  640px  @media (min-width: 640px)
md:  768px  @media (min-width: 768px)
lg:  1024px @media (min-width: 1024px)
xl:  1280px @media (min-width: 1280px)
2xl: 1536px @media (min-width: 1536px)
```

### **Mobile-First**
- Base styles pour mobile
- Progressive enhancement
- Touch targets 48px minimum
- Simplified layouts on small screens

---

## ♿ Accessibilité

### **Checklist**
- [ ] Contraste WCAG AA (4.5:1)
- [ ] Focus visible
- [ ] ARIA labels
- [ ] Navigation clavier
- [ ] Screen reader compatible
- [ ] Touch targets 48px
- [ ] Alt text images

### **Focus States**
```css
focus:outline-none 
focus:ring-2 
focus:ring-primary-500 
focus:ring-offset-2
```

---

## 🎯 Composants par Page

### **Landing Page**
- Hero avec CTA principal
- Features grid (3 colonnes)
- How it works (3 étapes)
- Social proof (stats)
- Final CTA
- Footer

### **Dashboard**
- Hero section avec action principale
- Grid 1/3 (sidebar + content)
- Quick stats cards
- Video list avec filters

### **Auth Pages (Login/Register)**
- Split screen (50/50)
- Formulaire centré
- Branding fort
- Social login options

### **Settings**
- Sidebar navigation
- Form sections
- Save states
- Danger zone

---

## 🔄 États des Composants

### **Loading**
```tsx
<div className="animate-pulse">
  <Skeleton />
</div>
```

### **Success**
```tsx
<div className="bg-green-50 text-green-800 border-green-200">
  <CheckCircle /> Message
</div>
```

### **Error**
```tsx
<div className="bg-red-50 text-red-800 border-red-200">
  <AlertCircle /> Message
</div>
```

---

## 📦 Librairies Utilisées

- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations (optionnel)
- **Next.js 14** - Framework

---

**Version:** 1.0.0  
**Date:** 2024  
**Design par:** Expert UX/UI
