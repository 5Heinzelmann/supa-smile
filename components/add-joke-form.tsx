"use client";

import {useState} from "react";
// import {createClient} from "@/lib/supabase/client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent,} from "@/components/ui/card";

interface AddJokeFormProps {
  onJokeAdded?: () => void;
}

export function AddJokeForm({ onJokeAdded }: AddJokeFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    console.log(text)
    // code goes here


      setText("");
      if (onJokeAdded) {
        onJokeAdded();
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

            <Button type="submit" className="w-full" >
              Share the Smiles!
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}