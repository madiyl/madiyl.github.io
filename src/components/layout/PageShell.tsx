import type { PropsWithChildren } from "react";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f1ea_0%,#f3ede6_26%,#efe7dd_100%)] text-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,255,255,0)_62%)]" />
        <div className="absolute inset-x-0 top-[18%] h-px bg-[linear-gradient(90deg,rgba(165,145,123,0),rgba(165,145,123,0.18),rgba(165,145,123,0))]" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(168,146,121,0),rgba(168,146,121,0.12),rgba(168,146,121,0))] lg:block" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
