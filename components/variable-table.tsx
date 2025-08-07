"use client"

import React from "react"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export function VariableTable({ projectId, envId }: { projectId: string; envId: string }) {
    const { getProjectById, addVariable, updateVariable, deleteVariable } = useData()
    const env = getProjectById(projectId)?.environments.find((e) => e.id === envId)
    const [showValues, setShowValues] = React.useState(false)

    if (!env) return null

    return (
        <Card className="p-0 overflow-hidden border-border/60 bg-card/60">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/60">
                <div className="text-sm text-muted-foreground">{env.variables.length} variables</div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowValues((s) => !s)} aria-label={showValues ? "Hide values" : "Show values"}>
                        {showValues ? <EyeOff className="size-4 mr-1" /> : <Eye className="size-4 mr-1" />}
                        {showValues ? "Hide values" : "Show values"}
                    </Button>
                    <AddVariableDialog
                        onSubmit={(data) => addVariable(projectId, envId, data)}
                        trigger={
                            <Button size="sm" className="gap-2" aria-label="Add Variable">
                                <Plus className="size-4" />
                                Add Variable
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="divide-y divide-border/60">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2 text-xs text-muted-foreground">
                    <span>Name</span>
                    <span>Value</span>
                    <span className="sr-only">Actions</span>
                </div>

                <AnimatePresence initial={false}>
                    {env.variables.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-4 py-10 text-center text-muted-foreground"
                        >
                            No variables yet
                        </motion.div>
                    ) : (
                        env.variables.map((v) => (
                            <motion.div
                                key={v.id}
                                layout
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 px-4 py-3"
                            >
                                <code className="text-sm">{v.name}</code>
                                <div className="text-sm font-mono text-zinc-300">
                                    {showValues ? v.value : "••••••••"}
                                </div>
                                <div className="flex items-center justify-end gap-1.5">
                                    <EditVariableDialog
                                        defaultName={v.name}
                                        defaultValue={v.value}
                                        onSubmit={(data) => updateVariable(projectId, envId, v.id, { name: data.name, value: data.value })}
                                    >
                                        <Button variant="ghost" size="icon" aria-label="Edit Variable">
                                            <Pencil className="size-4" />
                                        </Button>
                                    </EditVariableDialog>
                                    <ConfirmDialog
                                        title="Delete variable"
                                        description={`Remove ${v.name}?`}
                                        onConfirm={() => deleteVariable(projectId, envId, v.id)}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete Variable">
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
}: {
    trigger: React.ReactNode
    onSubmit: (data: { name: string; value: string }) => void
}) {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState("")
    const [value, setValue] = React.useState("")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Variable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="var-name">Name</Label>
                        <Input id="var-name" placeholder="API_URL" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="var-value">Value</Label>
                        <Input id="var-value" placeholder="https://api.example.com" value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            onSubmit({ name: name.trim(), value })
                            setOpen(false)
                            setName("")
                            setValue("")
                        }}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditVariableDialog({
    children,
    defaultName,
    defaultValue,
    onSubmit,
}: {
    children: React.ReactNode
    defaultName: string
    defaultValue: string
    onSubmit: (data: { name: string; value: string }) => void
}) {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState(defaultName)
    const [value, setValue] = React.useState(defaultValue)

    React.useEffect(() => {
        if (open) {
            setName(defaultName)
            setValue(defaultValue)
        }
    }, [open, defaultName, defaultValue])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Variable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-value">Value</Label>
                        <Input id="edit-value" value={value} onChange={(e) => setValue(e.target.value)} />
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
