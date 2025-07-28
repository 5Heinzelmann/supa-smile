import {JokePageClient} from "@/components/joke-page-client";
import {createClient} from "@/lib/supabase/server";

export default async function Home() {

    // const joke = {
    // id: "1",
    // text: "Hier könnte Ihre Witz stehen!",
    // is_current: true,
    // reactions: [],
    // created_at: new Date().toISOString(),
    // }

    const supabase = await createClient();
    const { data: joke } = await supabase
      .from('jokes')
      .select('*, reactions(*)')
      .eq('is_current', true)
      .single();

  return (
    <main className="flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-8 items-center">
        <div className="flex-1 flex flex-col gap-8 max-w-3xl w-full p-5">
            <h1 className="text-3xl font-bold text-center">Choose your reaction</h1>
          <JokePageClient initialJoke={joke} />
        </div>
      </div>
    </main>
  );
}
