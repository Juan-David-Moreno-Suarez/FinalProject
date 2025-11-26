import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { router, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthData = {
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthData>({
  loading: true,
  session: null,
});

interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthProvider(props: AuthContextProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const rootPath = useSegments()[0];

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session) {
          const { data: user, error: userError } = await supabase.auth.getUser();

          if (userError || !user) {
            await supabase.auth.signOut();
            setSession(null);
            router.replace("/");
          } else {
            setSession(data.session);
          }
        } else {
          router.replace("/");
        }
      } catch {
        setSession(null);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, newSession) => {
      setSession(newSession);
      setLoading(false);

      if (newSession && rootPath !== "(main)") {
        router.replace("/(main)/home");
      } else if (!newSession && rootPath === "(main)") {
        router.replace("/");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loading, session }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
