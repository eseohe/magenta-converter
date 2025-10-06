import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, Wand2 } from "lucide-react";

export function AppShell({ children, onHome, title = "Magenta Converter" }: { children: ReactNode; onHome?: () => void; title?: string; }) {
  return (
    <div className="min-h-screen bg-background bg-magenta-soft">
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/15 grid place-items-center text-primary">
              <Wand2 className="size-4" />
            </div>
            <button onClick={onHome} className="text-lg font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer">
              {title}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={() => document.documentElement.classList.toggle('dark')}>
              <Moon className="size-4 dark:hidden" />
              <Sun className="size-4 hidden dark:inline" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main>
      <footer className="container pb-10 pt-8 text-center text-sm text-muted-foreground">Built with React + Vite + Tailwind + shadcn/ui</footer>
    </div>
  );
}
