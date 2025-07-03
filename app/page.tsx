import { ClientAuthButton } from "@/components/client-auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { JokePageClient } from "@/components/joke-page-client";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch the current joke
  const { data: joke } = await supabase
    .from('jokes')
    .select('*, reactions(*)')
    .eq('is_current', true)
    .single();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-8 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>SupaSmile</Link>
            </div>
            <div className="flex items-center gap-4">
              <ClientAuthButton />
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col gap-8 max-w-3xl w-full p-5">
          <h1 className="text-3xl font-bold text-center">SupaSmile</h1>
          
          <JokePageClient initialJoke={joke} />
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
