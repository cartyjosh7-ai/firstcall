import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "manager" | "employee";
  }
  interface Session {
    user: {
      id: string;
      role: "manager" | "employee";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "manager" | "employee";
  }
}
