import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import { useTheme } from "@/hooks/useTheme";
import { useHubItems } from "@/hooks/useHubItems";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const hub = useHubItems();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(122,162,255,0.18),transparent_60%)] dark:bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(122,162,255,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_90%_10%,rgba(192,132,252,0.12),transparent_55%)] dark:bg-[radial-gradient(900px_520px_at_90%_10%,rgba(192,132,252,0.10),transparent_55%)]" />
      </div>

      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:pt-28">
        <Hero />
        <section className="mt-12 sm:mt-14">
          <ToolGrid items={hub.items} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
