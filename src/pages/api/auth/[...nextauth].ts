//src/pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";



export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
        // console.log('JWT callback invoked');
      // console.log('Token before:', token);
      // console.log('User:', user);
      // console.log('Account:', account);
      // console.log('Profile:', profile);
      // console.log('IsNewUser:', isNewUser);
      // console.log('Trigger:', trigger);
      // console.log('----------------------------------------------------------------------------');

      if (user) {
        token.id = user.id;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      } else if (account) {
        token.id = account.id;
        token.user = {
          id: account.id,
          name: profile?.name,
          email: profile?.email,
          image: profile?.image,
        };
      }

      //console.log('Token after:', token);
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      // console.log('Session callback invoked');
      // console.log('Session before:', session);
      // console.log('Token:', token);
      // console.log('----------------------------------------------------------------------------');

      if (token.id) {
        session.user.id = token.id;
      }

      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
        };
      }

      //console.log('Session after:', session);
      return session;
    },
  }
};

export default NextAuth(authOptions);