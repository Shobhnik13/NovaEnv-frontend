import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { dark } from '@clerk/themes'
// import faviconImage from '../public/favicon.png'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "NovaEnv - Environment Variable Manager",
  description: "Securely manage environment variables across projects via dashboard and CLI",
  icons: {
    icon: "./favicon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" className="dark" style={{ colorScheme: "dark" as const }}>
        <body
          className={[
            GeistSans.className,
            GeistMono.variable,
            "antialiased bg-background text-foreground min-h-svh",
          ].join(" ")}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
