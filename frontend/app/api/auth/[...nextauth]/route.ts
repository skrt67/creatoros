import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.googleId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).googleId = token.googleId;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

          // Créer ou récupérer l'utilisateur depuis le backend
          const response = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              google_id: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Stocker le token dans le token JWT pour le récupérer côté client
            if (data.access_token) {
              (user as any).backendToken = data.access_token;
            }
          }

          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return true;
        }
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
