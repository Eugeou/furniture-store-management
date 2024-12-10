"use client";

// import { login } from "@/services/auth-service";
import { StoreLogin, UserProps } from "@/types/entities/auth-entity";
// import { AxiosError } from "axios";
import { useSession, signOut, signIn } from "next-auth/react";
//import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface UseSessionAuth {
  user?: UserProps;
  accessToken?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  onLogin: (value: StoreLogin) => Promise<string | null>;
  onLogout: () => Promise<void>;
}
const useSessionAuth = (onLoginSuccess?: () => void): UseSessionAuth => {

  const { data: session, status } = useSession();
  //const router = useRouter();

  const onLogout = useCallback(async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  }, []);

  const onLogin = useCallback(async (value: StoreLogin) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        ...value,
        callbackUrl: "/",
      });

      if (result?.error) {
        console.log("Server error during login:", result.error);
        console.log(result);
        return result.error;
      }

      console.log(result);
      onLoginSuccess?.();
    } catch (error : Error | any) {
    
      console.log("Internal error during login:", error);
      return error.message || "Unknown error occurred";
    }
  }, [ onLoginSuccess ]);

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    onLogin,
    onLogout,
  };
};

export default useSessionAuth;
