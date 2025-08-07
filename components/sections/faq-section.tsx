"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 md:px-8 py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold tracking-tight text-center"
      >
        Frequently asked questions
      </motion.h2>

      <Accordion type="single" collapsible className="mt-8 w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is this dark mode only?</AccordionTrigger>
          <AccordionContent>
            Yes. NovaEnv is designed as a dark-first, dark-only app for consistent, high-contrast readability.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Where are my variables stored?</AccordionTrigger>
          <AccordionContent>
            This demo uses local storage in your browser. In production, use a secure server and never expose secrets to the client.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I import/export .env files?</AccordionTrigger>
          <AccordionContent>
            The UI is designed to support .env import/export and conflict resolution in upcoming iterations.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
