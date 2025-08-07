"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function ShowcaseSection() {
    return (
        <section className="relative mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
            <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-center"
            >
                A sleek dashboard
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-center text-sm text-muted-foreground max-w-2xl mx-auto"
            >
                Built with shadcn/ui components, Tailwind CSS, and smooth framer-motion transitions.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-8 rounded-xl border border-border/60 bg-card/40 p-2"
            >
                <div className="relative overflow-hidden rounded-lg border border-border/60 bg-gradient-to-b from-zinc-900/50 to-zinc-900/30">
                    <Image
                        src="/placeholder.svg?height=720&width=1280"
                        alt="NovaEnv dashboard preview"
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                        priority
                    />
                    <motion.div
                        aria-hidden
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.08 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]"
                    />
                </div>
            </motion.div>
        </section>
    )
}
