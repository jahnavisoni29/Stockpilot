import type { NextAuthConfig } from "next-auth";

export default {
  providers: [], // filled in by auth.ts, kept empty here for Edge compatibility
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "admin" | "staff";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;