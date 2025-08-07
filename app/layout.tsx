import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import {
  ClerkProvider,
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "NovaEnv — Environment Variable Manager",
  description: "Securely manage environment variables across projects",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" as const }}>
        <body
          className={[
            GeistSans.className,
            GeistMono.variable,
            "antialiased bg-background text-foreground min-h-svh",
          ].join(" ")}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
