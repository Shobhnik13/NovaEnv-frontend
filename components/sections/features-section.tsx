"use client"

import { motion } from "framer-motion"
import { Shield, Layers, Workflow, LockKeyhole, Gauge, FileDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
    {
        title: "Secure by design",
        icon: Shield,
        description: "Your secrets are fully encrypted before storage, even we can not access or see what you have stored",
    },
    {
        title: "Projects & environments",
        icon: Layers,
        description: "Organize variables per project and environment for clean separation.",
    },
    {
        title: "Effortless workflow",
        icon: Workflow,
        description: "Fully customisable so you can add, edit and delete your workflows effortlessly.",
    },
    {
        title: "Granular control",
        icon: LockKeyhole,
        description: "Toggle visibility, inline edits, and confirmations to prevent mistakes.",
    },
    {
        title: "Fast & Optimized",
        icon: Gauge,
        description: "Optimized performance and design for the best user experience.",
    },
    {
        title: "Bulk Insert/Copy",
        icon: FileDown,
        description: "Copy your entire variables from a file at once, no more adding them one by one. ",
    },
]

export function FeaturesSection() {
    return (
        <section className="relative mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
            <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-center"
            >
                Core features
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-center text-sm text-muted-foreground max-w-2xl mx-auto"
            >
                A modern, metallic dark UI built for clarity, speed, and control.
            </motion.p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                        <Card className="bg-card/60 border-border/60 hover:bg-card/80 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-3 text-base">
                                    <item.icon className="size-4 text-zinc-200" aria-hidden />
                                    <span>{item.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
