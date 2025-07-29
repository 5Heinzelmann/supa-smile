"use client";

import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent,} from "@/components/ui/card";

interface AddJokeFormProps {
  onJokeAdded?: () => void;
}

export function AddJokeForm({ onJokeAdded }: AddJokeFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError("Hey! You gotta give us some supa-funny content first! 😅");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: insertError } = await supabase
        .from('jokes')
        .insert({
          text: text.trim()
        });

      if (insertError) throw insertError;

      setSuccess("Supa-awesome! Your joke is now part of the smile collection! 🎉");
      setText("");
      
      if (onJokeAdded) {
        onJokeAdded();
      }

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="text">Your Joke</Label>
              <Input
                id="text"
                type="text"
                placeholder="What's gonna make everyone smile today? 😊"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Making it supa-official..." : "Share the Smiles!"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}