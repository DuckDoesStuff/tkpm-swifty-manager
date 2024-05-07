"use client";
import {usePathname, useRouter} from "next/navigation";
import React, {createContext, useContext, useEffect, useState} from "react";
import {UserInfo} from "@firebase/auth";

export const AuthContext = createContext<UserInfo | null>(null);

export function AuthContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Call the backend to verify the cookie session
    fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/session/merchant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookies
    })
      .then(async (response) => {
        const result = await response.json();
        if (result.statusCode === 200) {
          setUser(result.data);
        } else {
          console.log("Not user");
          if (pathname !== "/auth/signup" && pathname !== "/auth/signin")
            router.push("/auth/signin");
        }
      })
      .catch((error) => {
        console.log(error);
        if (pathname !== "/auth/signup" && pathname !== "/auth/signin")
          router.push("/auth/signin");
      });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
