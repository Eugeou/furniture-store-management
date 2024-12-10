import NextAuth, { DefaultSession } from "next-auth";
import { StoreUser } from "./entities/user.entity";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    user?: StoreUser;
  }
  interface Session {
    accessToken?: string;
    user?: StoreUser & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    user?: StoreUser;
  }
}
