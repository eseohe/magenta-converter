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
              Magenta Converter
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
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2 text-primary">
              <Wand2 className="size-5" />
              <span className="font-semibold text-lg">Magenta Converter</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A comprehensive suite of conversion tools for units, currencies, calculations, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
              <span>Built with</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-[#61DAFB]">React</span>
                <span>•</span>
                <span className="font-medium text-[#646CFF]">Vite</span>
                <span>•</span>
                <span className="font-medium text-[#06B6D4]">Tailwind CSS</span>
                <span>•</span>
                <span className="font-medium">shadcn/ui</span>
              </div>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Magenta Converter. Made with ❤️ for productivity.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
