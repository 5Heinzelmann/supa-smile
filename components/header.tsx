import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { ClientAuthButton } from "./client-auth-button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          SupaSmile
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <ClientAuthButton />
        </div>
      </div>
    </header>
  );
}