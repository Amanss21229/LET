import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  trustHost: true,

  providers: [
    Google({
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (
        new URL(url).origin ===
        new URL(baseUrl).origin
      ) {
        return url;
      }

      return baseUrl;
    },
  },
});
