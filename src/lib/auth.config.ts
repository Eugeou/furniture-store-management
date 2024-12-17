import { StoreLogin, StoreUser, UserProps } from "@/types/entities/auth-entity";
import type { JWT, NextAuthOptions } from "next-auth";
import axios, { AxiosResponse } from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import envConfig from "@/configs/config";


const BASE_URL = envConfig.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5001/api/v1";

export interface SessionAuth {
  accessToken: string;
  user: UserProps;
}
export interface JWTAuth {
  accessToken: string;
  user: UserProps;
}
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        console.log(credentials);
        try {
          const { data } = await axios.post<
            StoreLogin,
            AxiosResponse<{ data: StoreUser }>
          >(`${BASE_URL}/auth/signin`, {
            email: credentials.email,
            password: credentials.password,
          });
          console.log(data);

          //const data = await res.json();

          if (data.data?.AccessToken) {
            const Id = data.data.UserId;
            const { data: dataUser } = await axios.post<
              AxiosResponse<UserProps>
            >(`${BASE_URL}/auth/me`,
                JSON.stringify(Id),
                {
                    headers: { 
                        Authorization: `Bearer ${data.data?.AccessToken}`,
                        "Content-Type": "application/json",

                    },
                }
            );
            return {
              id: dataUser?.data.Id,
              user: dataUser?.data,
              accessToken: data.data?.AccessToken,
            };
          }
        //console.log(53, data);
          throw new Error("Invalid credentials");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(
              error.response?.data?.message || error.message || "Login failed"
            );
          } else {
            throw new Error("Login failed");
          }
        }
      },
    }),
  ],
  // pages: {
  //   error: '/error', 
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as unknown as JWTAuth).accessToken;
        token.user = user;
      }
      console.log(token);
      return token;
    },
    // Callback session để lưu access token vào session
    async session({ session, token }) {
      session.accessToken = (token as JWT).accessToken;
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;
