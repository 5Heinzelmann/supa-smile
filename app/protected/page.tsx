import {AdminPageClient} from "@/components/admin-page-client";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-3xl mx-auto">

      <div className="flex flex-col gap-6">
        <h1 className="font-bold text-2xl">Joke Management</h1>
        
        <AdminPageClient />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Use the controls above to manage jokes. The current joke will be displayed on the main page
          for all users to see and react to.
        </p>
      </div>
    </div>
  );
}
