"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Package, Shield, Sparkles, Terminal, Zap } from 'lucide-react'
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

      <section className="relative mx-auto max-w-screen-lg px-6 md:px-8 py-16 md:py-24 min-h-[80svh] flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-4"
        >
          <Link
            href="https://peerlist.io/shobhnik13/project/novaenv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-400 backdrop-blur-sm hover:bg-green-500/20 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <span>We are live on Peerlist please upvote 👍</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/20 px-3 py-1.5 mb-6 text-xs text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles className="size-3.5 text-zinc-300" aria-hidden />
          <span>Secure. Fast. Simple.</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
        >
          <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#fafafa_0%,#bdbdbf_22%,#8a8a90_48%,#f1f1f2_70%,#9a9aa0_88%,#fafafa_100%)] [background-size:220%_auto] animate-[shimmer_4.5s_linear_infinite]">
            NovaEnv
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          The one stop environment variable management platform. Secure, scalable, and fully customisable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-zinc-400" />
            <span>End-to-end encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-zinc-400" />
            <span>Lightning fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-zinc-400" />
            <span>CLI integration</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button asChild size="lg" className="group">
            <Link href={`${isSignedIn ? '/dashboard' : '/sign-in'}`} aria-label="Go to Dashboard">
              Get Started Free
              <ArrowRight
                className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="https://www.npmjs.com/package/novaenv-cli"
            target="_blank"
            rel="noopener noreferrer">
            <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-800 px-4 py-2.5 text-sm font-medium text-red-800 transition-colors cursor-default">
              <Package className="size-4" />
              <span>npm i novaenv-cli</span>
              </Link>
            </div>

            <Button asChild size="sm" variant="outline" className="group bg-transparent">
              <Link href="/cli" aria-label="CLI Documentation">
                <Terminal className="mr-2 size-4" />
                CLI Quickstart
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-md"
        >
          <div className="rounded-lg border border-border/60 bg-card/20 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              </div>
              <span className="text-xs text-muted-foreground ml-2">terminal</span>
            </div>
            <div className="font-mono text-sm text-left">
              <div className="text-zinc-400">$ novaenv login api-key</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-green-400"
              >
                ✓ Projects fetching...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-green-400"
              >
                ✓ Variables extracting...
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      <ShowcaseSection />

      <SectionDivider />

      {/* Features */}
      <FeaturesSection />

      <SectionDivider />

      {/* How it works */}
      <HowItWorksSection />

      <SectionDivider />

      {/* Footer */}
      <footer className="relative mx-auto max-w-6xl px-6 md:px-8 py-12">


        <div className="pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 NovaEnv. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>

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
