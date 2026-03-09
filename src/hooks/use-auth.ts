import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AppUser {
  id: string; // public users.id
  authId: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = useCallback(async (authUser: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, auth_id")
      .eq("auth_id", authUser.id)
      .maybeSingle();

    if (data) {
      setAppUser({
        id: data.id,
        authId: data.auth_id!,
        name: data.name,
        email: data.email,
        role: data.role as AppUser["role"],
      });
    } else {
      setAppUser(null);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(() => fetchAppUser(session.user), 0);
        } else {
          setAppUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchAppUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchAppUser]);

  const signUp = async (email: string, password: string, name: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAppUser(null);
    setSession(null);
  };

  return { session, appUser, loading, signUp, signIn, signOut };
}
