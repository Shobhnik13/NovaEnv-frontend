"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RotateCcw, AlertTriangle, Check, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import envConfig from "@/envConfig"
import { toast } from "sonner"

export default function ApiKeyPage() {
    const [apiKey, setApiKey] = useState("")
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [isCopying, setIsCopying] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    function maskApiKey(key: string) {
        if (!key) return "";
        if (key.length <= 8) return key;

        const visibleChars = 4;
        const start = key.slice(0, visibleChars);
        const end = key.slice(-visibleChars);
        const masked = "•".repeat(key.length - visibleChars * 2);
        return `${start}${masked}${end}`;
    }

    const { isSignedIn, user, isLoaded } = useUser()
    const { getToken } = useAuth()

    const handleCopy = async () => {
        try {
            setIsCopying(true)
            await navigator.clipboard.writeText(apiKey)
            setIsCopied(true)
        } catch (error) {
        } finally {
            setTimeout(() => {
                setIsCopying(false)
                setIsCopied(false)
            }, 2000) // Show checkmark for 2 seconds
        }
    }

    const handleRegenerate = async () => {
        setIsRegenerating(true)
        try {
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.authUrl}/regenerate-api-key`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setIsRegenerating(false)
            if (res.status === 200) {
                setApiKey(data?.apiKey)
                toast.success('API KEY regenerated successfully')
            } else {
                toast.error(`${data?.error || data?.message}`)
            }
        } catch (err) {
            toast.error(`${err}`)
            console.error(err)
        } finally {
            setIsRegenerating(false)
        }
    }

    const fetchKey = async () => {
        try {
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.authUrl}/api-key`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setApiKey(data?.apiKey)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchKey()
    }, [user, getToken])

    if (loading || !isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
            </div>
        )
    }



    return (
        <div className="space-y-6 mt-2">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">API Key</h1>
                <p className="text-sm text-muted-foreground">Manage your API key for CLI operations</p>
            </div>

            {/* Warning Card */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="border-amber-200/20 bg-amber-50/5">
                    <CardContent className="flex items-start gap-3 pt-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-200/90 mb-1">Keep this secret</p>
                            <p className="text-sm text-amber-200/70">
                                This is a secret key. Do not share or expose it publicly as it will be used for performing CLI
                                operations.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* API Key Card */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card className="bg-card/60 border-border/60">
                    <CardHeader>
                        <CardTitle className="text-lg">Your API Key</CardTitle>
                        <CardDescription>Use this key to authenticate CLI operations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="api-key"
                                    value={maskApiKey(apiKey)}
                                    readOnly
                                    className="font-mono text-sm bg-muted/50 cursor-default select-all"
                                    style={{ pointerEvents: "none", userSelect: "all" }}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    disabled={isCopying}
                                    aria-label="Copy API key"
                                >
                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button variant="destructive" onClick={handleRegenerate} disabled={isRegenerating} className="gap-2">
                                <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
                                {isRegenerating ? "Regenerating..." : "Regenerate Key"}
                            </Button>
                            <p className="text-xs text-muted-foreground">Regenerating will invalidate the current key immediately.</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

        </div>
    )
}
