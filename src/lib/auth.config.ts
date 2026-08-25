import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the Auth.js config — no providers, no database import,
 * so this can run in Next.js middleware. The real Credentials provider
 * (which touches Postgres) lives in `auth.ts` and is only ever loaded in
 * Node-runtime route handlers / server components, never in middleware.
 */
export const authConfig = {
  pages: {
    signIn: "/crm/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isCrm = request.nextUrl.pathname.startsWith("/crm");
      const isPublicCrmPage =
        request.nextUrl.pathname === "/crm/login" || request.nextUrl.pathname === "/crm/setup";
      if (!isCrm || isPublicCrmPage) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: "manager" | "employee" }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "manager" | "employee";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
