import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HubItem } from "@/utils/hubItems";

function statusTone(status: HubItem["status"]) {
  if (status === "已完成") {
    return "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-300/20";
  }
  return "bg-neutral-900/5 text-neutral-700 ring-neutral-900/10 dark:bg-white/10 dark:text-neutral-200 dark:ring-white/10";
}

function kindTone(kind: HubItem["kind"]) {
  if (kind === "工具") {
    return "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-300/20";
  }
  return "bg-purple-500/10 text-purple-700 ring-purple-500/20 dark:bg-purple-400/10 dark:text-purple-200 dark:ring-purple-300/20";
}

export default function ToolCard(props: { item: HubItem }) {
  const { item } = props;
  const Icon = item.icon;
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-md",
        "transition will-change-transform",
        "hover:border-neutral-300/70 hover:bg-white/70 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20",
        "dark:border-white/10 dark:bg-neutral-950/40",
        "dark:hover:border-white/16 dark:hover:bg-neutral-950/55 dark:hover:shadow-none dark:focus-visible:ring-white/20"
      )}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950/5 text-neutral-800 ring-1 ring-neutral-900/10 dark:bg-white/10 dark:text-neutral-100 dark:ring-white/10">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-semibold tracking-tight">{item.title}</div>
            </div>
          </div>
        </div>

        <ArrowUpRight className="mt-1 h-4 w-4 text-neutral-400 transition group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        {item.description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", kindTone(item.kind))}>
          {item.kind}
        </span>
        <span
          className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1", statusTone(item.status))}
        >
          {item.status}
        </span>
      </div>
    </motion.a>
  );
}
