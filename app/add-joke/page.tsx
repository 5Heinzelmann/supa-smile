"use client";

import { useState } from "react";
import { AddJokeForm } from "@/components/add-joke-form";
import { JokeList } from "@/components/joke-list";

export default function AddJokePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJokeAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-y-12 max-w-2xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="font-bold text-2xl">Post your Joke</h1>
        <AddJokeForm onJokeAdded={handleJokeAdded} />
      </div>
      
      <JokeList refreshTrigger={refreshTrigger} />
    </div>
  );
}