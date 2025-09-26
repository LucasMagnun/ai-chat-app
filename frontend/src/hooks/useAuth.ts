"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, getIdToken, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { AppUser } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            // pega token do firebase
            const token = await getIdToken(firebaseUser);
            localStorage.setItem("token", token);

            // chama seu backend
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!res.ok) {
              throw new Error("Erro ao validar usuário no backend");
            }

            const data = await res.json();
            setUser(data); // aqui vem o user do banco
            setToken(token); // adiciona token no estado
          } catch (err) {
            console.error(err);
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, token, loading };
}
