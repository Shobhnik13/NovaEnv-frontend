"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Brain, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignIn, useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
    const { isSignedIn, isLoaded } = useUser()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            redirect("/dashboard")
        }
    }, [isLoaded, isSignedIn])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to home
                    </Link>
               
                    <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
                    <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            We only support Google sign in as of now
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SignIn />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
