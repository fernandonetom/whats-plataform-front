import React, { createContext, useEffect, useState } from "react";
import { api } from "../services/api.service";

interface IUser {
  email: string;
  token: string;
}

interface IContext {
  user: IUser | null;
  signed: boolean;
  signIn(email: string, password: string): Promise<void>;
}

const defaultContext: IContext = {
  user: null,
  signed: false,
  signIn: async (email: string, password: string): Promise<void> => {},
};

export const AuthContext = createContext<IContext>(defaultContext);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData) as IUser;

        if (parsed?.token) {
          setUser(parsed);
          console.log("salvou");
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const { data } = await api.post<IUser>("/auth/login", {
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
