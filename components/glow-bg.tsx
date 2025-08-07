"use client"

import { motion } from "framer-motion"

export function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Subtle radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(140,140,145,0.08),transparent_60%)]" />

      {/* Moving glow orbs */}
      <motion.div
        initial={{ opacity: 0.28, scale: 0.95, x: 0, y: 0 }}
        animate={{ opacity: 0.42, scale: 1, x: 10, y: -6 }}
        transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 right-[-8%] h-72 w-72 rounded-full blur-3xl bg-gradient-to-br from-zinc-600/20 via-zinc-500/12 to-zinc-300/10"
      />
      <motion.div
        initial={{ opacity: 0.22, scale: 0.95, x: 0, y: 0 }}
        animate={{ opacity: 0.35, scale: 1, x: -8, y: 8 }}
        transition={{ duration: 5, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full blur-3xl bg-gradient-to-tr from-zinc-600/18 via-zinc-500/10 to-zinc-300/8"
      />

      {/* Soft metallic sheen stripe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-x-0 top-1/3 h-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
      />

      {/* Lightweight noise/dot pattern via radial gradient grid */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:8px_8px]" />
    </div>
  )
}
