"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import envConfig from "@/envConfig"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AddEnvironmentDialog({
    children,
    projectId,
    env,
    mode = "create",
    onCreated
}: {
    children?: React.ReactNode
    projectId: string
    env?: any,
    mode?: "create" | "edit",
    onCreated?: () => void
}) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(env?.name ?? "")
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    useEffect(() => {
        if (open && env) setName(env.name)
    }, [open, env])

    const handleSubmit = async () => {
        if (!name.trim()) return

        setLoading(true)
        try {
            const token = await getToken()

            const url =
                mode === "edit"
                    ? `${envConfig.enviornmentUrl}/projects/enviornments/${env.enviornmentId}`
                    : `${envConfig.enviornmentUrl}/projects/${projectId}/create-enviornment`

            const method = mode === "edit" ? "PUT" : "POST"

            const body =
                mode === "edit"
                    ? { name: name.trim() }
                    : { name: name.trim() }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })

            const data = await res.json()
            if (res.status === 200) {
                toast.success(`${data?.message}`)
                onCreated?.()
            } else {
                toast.error(`${data?.error || data?.message}`)
            }
            setOpen(false)
            setName("")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? <Button>Add Environment</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Environment" : "Add Environment"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="env-name">Name</Label>
                        <Input
                            id="env-name"
                            placeholder="Development"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => handleSubmit()} disabled={loading || !name.trim()}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "edit" ? "Saving..." : "Creating..."}
                            </>
                        ) : (
                            mode === "edit" ? "Save" : "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
