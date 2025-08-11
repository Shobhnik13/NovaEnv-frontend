"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { GlowBackground } from "@/components/glow-bg"
import { FeaturesSection } from "@/components/sections/features-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { ShowcaseSection } from "@/components/sections/showcase-section"
import { FaqSection } from "@/components/sections/faq-section"
import { FinalCtaSection } from "@/components/sections/final-cta-section"
import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function LandingPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const checkProtect = () => {
      if (!isLoaded) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
          </div>
        )
      }
      if (isLoaded && isSignedIn) {
        redirect("/dashboard")
      }
    }
    checkProtect()
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
      </div>
    )
  }
  return (
    <main className="relative min-h-svh bg-background text-foreground overflow-hidden">
      <GlowBackground />

      {/* Hero */}
      <section className="relative mx-auto max-w-screen-md px-6 md:px-8 py-16 md:py-24 min-h-[70svh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/20 px-3 py-1.5 mb-6 text-xs text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-zinc-300" aria-hidden />
          <span>Dark. Sleek. Secure.</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#fafafa_0%,#bdbdbf_22%,#8a8a90_48%,#f1f1f2_70%,#9a9aa0_88%,#fafafa_100%)] [background-size:220%_auto] animate-[shimmer_4.5s_linear_infinite]">
            NovaEnv
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 text-base md:text-lg text-muted-foreground"
        >
          Securely manage environment variables across all your projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="group">
            <Link href="/dashboard" aria-label="Go to Dashboard">
              Go to Dashboard
              <ArrowRight
                className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Button>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Features */}
      <FeaturesSection />

      <SectionDivider />

      {/* How it works */}
      <HowItWorksSection />

      <SectionDivider />

      {/* Showcase */}
      <ShowcaseSection />

      <SectionDivider />

      {/* FAQ */}
      <FaqSection />

      <SectionDivider />

      {/* Final CTA */}
      <FinalCtaSection />

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 220% 50%; }
        }
      `}</style>
    </main>
  )
}

function SectionDivider() {
  return (
    <div aria-hidden className="relative mx-auto max-w-6xl px-6 md:px-8">
      <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
    </div>
  )
}
