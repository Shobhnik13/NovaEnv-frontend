"use client"

import { motion } from "framer-motion"
import { PlusCircle, ListTree, Variable } from 'lucide-react'

const steps = [
    {
        title: "Create a project",
        description: "Start with a project to group related environments.",
        icon: PlusCircle,
    },
    {
        title: "Add environments",
        description: "Development, Staging, Production — or your own.",
        icon: ListTree,
    },
    {
        title: "Manage variables",
        description: "Add, edit, mask, and delete with confidence.",
        icon: Variable,
    },
]

export function HowItWorksSection() {
    return (
        <section className="relative mx-auto max-w-4xl px-6 md:px-8 py-12 md:py-16">
            <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-center"
            >
                How it works
            </motion.h2>

            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                    <motion.li
                        key={s.title}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.05 }}
                        className="rounded-xl border border-border/60 bg-card/50 p-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-md bg-zinc-900/70 border border-border/60 grid place-items-center">
                                <s.icon className="size-4" aria-hidden />
                            </div>
                            <div className="text-sm font-medium">{s.title}</div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                    </motion.li>
                ))}
            </ol>
        </section>
    )
}
