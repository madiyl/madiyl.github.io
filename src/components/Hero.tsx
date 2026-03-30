import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/60 px-6 py-10 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/40 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(122,162,255,0.28),transparent_60%)] blur-2xl" />
        <div className="absolute -right-10 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.20),transparent_60%)] blur-2xl" />
      </div>

      <motion.div
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-400">
            记录生活，分享灵感。
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
          这里收集了我们的生活攻略、旅行计划与实用小工具。保持克制与清爽，只保留你真正会点击的入口。
        </p>
      </motion.div>
    </section>
  );
}
