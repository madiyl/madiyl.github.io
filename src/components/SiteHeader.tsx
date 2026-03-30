import { Moon, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SiteHeader(props: { isDark: boolean; onToggleTheme: () => void }) {
  const { isDark, onToggleTheme } = props;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "border-b border-neutral-200/60 bg-white/70 backdrop-blur-md",
        "dark:border-white/10 dark:bg-neutral-950/60"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold tracking-tight">Life &amp; Tools Hub</div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full",
            "bg-neutral-950/5 text-neutral-700 transition",
            "hover:bg-neutral-950/10 active:bg-neutral-950/15",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20",
            "dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/14 dark:active:bg-white/18",
            "dark:focus-visible:ring-white/20"
          )}
        >
          {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
