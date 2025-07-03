"use client";

import { useEffect, useState } from "react";
import { AdminControls } from "@/components/admin-controls";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminPageClient() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleJokeChange = () => {
    // Force a refresh of the page data
    setRefreshKey(prev => prev + 1);
    // Refresh the page data
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
      
      <div className="bg-muted/50 p-4 rounded-md">
        <h2 className="font-semibold text-lg mb-2">Admin User</h2>
        <div className="text-sm text-muted-foreground mb-2">
          Logged in as: <span className="font-medium">{userEmail}</span>
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          User ID: {userId}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
}