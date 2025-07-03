export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SupaSmile - A real-time joke reaction application</p>
      </div>
    </footer>
  );
}