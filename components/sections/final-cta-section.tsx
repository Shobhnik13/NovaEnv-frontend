"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function FinalCtaSection() {
    return (
        <section className="relative mx-auto max-w-screen-md px-6 md:px-8 py-16 md:py-20 text-center">
            <motion.h3
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold tracking-tight"
            >
                Ready to manage variables with confidence?
            </motion.h3>
            <motion.p
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 text-sm text-muted-foreground"
            >
                Navigate projects, environments, and secrets in a fast, modern dashboard.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-7"
            >
                <Button asChild size="lg" className="group">
                    <Link href="/dashboard" aria-label="Go to Dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                </Button>
            </motion.div>
        </section>
    )
}
