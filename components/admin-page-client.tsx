"use client";

import {useEffect, useState} from "react";
import {AdminControls} from "@/components/admin-controls";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export function AdminPageClient() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // We use setRefreshKey in handleJokeChange but don't need the state itself
  const [, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          // Redirect to login if not authenticated
          router.push("/auth/login");
          return;
        }

        setUserEmail(data.user.email || null);
        setUserId(data.user.id);
      } catch (err) {
        console.error("Error checking authentication:", err);
        // Redirect to login on error
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);


  const handleJokeChange = () => {
    setRefreshKey(prev => prev + 1);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-pulse">Loading admin panel...</div>
      </div>
    );
  }

  if (!userEmail || !userId) {
    return null; // This shouldn't render as we redirect on auth failure
  }

  return (
    <>
      <div className="w-full">
        <AdminControls onJokeChange={handleJokeChange} />
      </div>
    </>
  );
}