"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from "@clerk/nextjs"
import envConfig from "@/envConfig"

export function VariableTable({ vars, onAddVariable, onUpdateVariable, onDeleteVariable, projectId, envId, onaddCallback }: any) {
    const [showValues, setShowValues] = useState(false)
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const addVariable = async (projectId: any, envId: any, data: any) => {
        if (!data.name.trim() || !data.value.trim()) return
        setLoading(true)
        try {
            const token = await getToken()
            const name = data.name.trim()
            const value = data.value.trim()
            const res = await fetch(`${envConfig.variableUrl}/project/${projectId}/create-variable/${envId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ key: name, value: value }),
            })
            const ans = await res.json()
            onaddCallback()
            setLoading(false)
            setDialogOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Card className="p-0 overflow-hidden border-border/60 bg-card/60">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/60">
                <div className="text-sm text-muted-foreground">{vars.length} variables</div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowValues(s => !s)}
                    >
                        {showValues ? <EyeOff className="size-4 mr-1" /> : <Eye className="size-4 mr-1" />}
                        {showValues ? "Hide values" : "Show values"}
                    </Button>
                    <AddVariableDialog
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        loading={loading}
                        onSubmit={(data) => addVariable(projectId, envId, data)}
                        trigger={
                            <Button disabled={loading} size="sm" className="gap-2" aria-label="Add Variable">
                                <Plus className="size-4" />
                                {loading ? "Adding..." : "Add Variable"}
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="divide-y divide-border/60">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2 text-xs text-muted-foreground">
                    <span>Key</span>
                    <span className="">Value</span>
                    <span className="sr-only">Actions</span>
                </div>

                <AnimatePresence initial={false}>
                    {vars.length === 0 ? (
                        <motion.div
                            key=""
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-4 py-10 text-center text-muted-foreground"
                        >
                            No variables exist for this environment
                        </motion.div>
                    ) : (
                        vars.map((v: any, index:number) => (
                            <motion.div
                                key={`var-${index}`}
                                layout
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 px-4 py-3"
                            >
                                <code className="text-sm">{v.key}</code>
                                <div className="text-sm font-mono text-zinc-300">
                                    {showValues ? v.value : "••••••••"}
                                </div>
                                <div className="flex items-center justify-end gap-1.5">
                                    <EditVariableDialog
                                        defaultName={v.key}
                                        defaultValue={v.value}
                                        onSubmit={(data: any) => onUpdateVariable(v.id, data)}
                                    >
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="size-4" />
                                        </Button>
                                    </EditVariableDialog>
                                    <ConfirmDialog
                                        title="Delete variable"
                                        description={`Remove ${v.name}?`}
                                        onConfirm={() => onDeleteVariable(v.id)}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </Card>
    )
}

function AddVariableDialog({
    trigger,
    onSubmit,
    open,
    setOpen,
    loading,
}: {
    trigger: React.ReactNode
    onSubmit: (data: { name: string; value: string }) => void
    open: boolean
    setOpen: (open: boolean) => void
    loading: boolean
}) {
    const [name, setName] = React.useState("")
    const [value, setValue] = React.useState("")

    useEffect(() => {
        if (!open) {
            setName("")
            setValue("")
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Variable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="var-name">Key</Label>
                        <Input
                            id="var-name"
                            placeholder="API_URL"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="var-value">Value</Label>
                        <Input
                            id="var-value"
                            placeholder="https://api.example.com"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            onSubmit({ name: name.trim(), value })
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {"Adding..."}
                            </>
                        ) : (
                            "Add"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditVariableDialog({ children, defaultName, defaultValue, onSubmit }: any) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(defaultName)
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        if (open) {
            setName(defaultName)
            setValue(defaultValue)
        }
    }, [open, defaultName, defaultValue])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Variable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Value</Label>
                        <Input value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            onSubmit({ name: name.trim(), value })
                            setOpen(false)
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
