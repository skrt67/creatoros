# Variables d'environnement Vercel pour CreatorOS

## Variables à configurer sur Vercel

Allez sur https://vercel.com/dashboard et configurez ces variables d'environnement pour votre projet :

### Variables critiques

1. **NEXT_PUBLIC_API_URL**
   - Valeur: `https://api.vidova.me`
   - Environnement: Production, Preview, Development

2. **NEXT_PUBLIC_GOOGLE_CLIENT_ID**
   - Valeur: `[VOTRE_GOOGLE_CLIENT_ID]`
   - Environnement: Production, Preview, Development

3. **NEXTAUTH_SECRET**
   - Valeur: `[VOTRE_NEXTAUTH_SECRET]`
   - Environnement: Production, Preview, Development

4. **NEXTAUTH_URL**
   - Valeur: `https://vidova.me`
   - Environnement: Production uniquement

5. **NEXTAUTH_GOOGLE_SECRET**
   - Valeur: `[VOTRE_GOOGLE_CLIENT_SECRET]`
   - Environnement: Production, Preview, Development

## Comment configurer

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans Settings > Environment Variables
4. Ajoutez chaque variable ci-dessus
5. Redéployez l'application

## Vérification

Après configuration, vérifiez que :
- Le frontend peut se connecter à l'API backend
- L'authentification Google fonctionne
- Les vidéos peuvent être soumises sans erreur
