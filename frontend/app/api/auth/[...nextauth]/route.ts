import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (response.ok) {
            const data = await response.json();
            return {
              id: credentials.email,
              email: credentials.email,
              accessToken: data.access_token
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
          
          // Register or login user with Google
          const response = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId
            })
          });

          if (response.ok) {
            const data = await response.json();
            // Store token for later use
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', data.access_token);
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }
      return true;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this',
});

export { handler as GET, handler as POST };
