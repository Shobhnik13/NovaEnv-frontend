"use client"

import React from "react"
import { useData, type Environment } from "@/components/data-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function AddEnvironmentDialog({
    children,
    projectId,
    env,
    mode = "create",
}: {
    children?: React.ReactNode
    projectId: string
    env?: Environment
    mode?: "create" | "edit"
}) {
    const [open, setOpen] = React.useState(false)
    const { addEnvironment, updateEnvironment } = useData()
    const [name, setName] = React.useState(env?.name ?? "")

    React.useEffect(() => {
        if (open && env) setName(env.name)
    }, [open, env])

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
                        <Input id="env-name" placeholder="Development" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            if (mode === "edit" && env) {
                                updateEnvironment(projectId, env.id, { name: name.trim() })
                            } else {
                                addEnvironment(projectId, name.trim())
                            }
                            setOpen(false)
                            setName("")
                        }}
                    >
                        {mode === "edit" ? "Save" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
