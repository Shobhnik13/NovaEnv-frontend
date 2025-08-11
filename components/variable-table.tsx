"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from "@clerk/nextjs"
import envConfig from "@/envConfig"
import { toast } from "sonner"

export function VariableTable({
    vars,
    onAddVariable,
    onUpdateVariable,
    onDeleteVariable,
    projectId,
    envId,
    onaddCallback,
}: any) {
    const [showValues, setShowValues] = useState(false)
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const addVariable = async (projectId: any, envId: any, data: any) => {
        const isBulk = Array.isArray(data)

        if (isBulk) {
            const validVariables = data.filter((v: any) => v.name?.trim() && v.value?.trim())
            if (validVariables.length === 0) return
        } else {
            if (!data.name?.trim() || !data.value?.trim()) return
        }

        setLoading(true)
        try {
            const token = await getToken()

            const payload = isBulk
                ? {
                    variables: data.map((v: any) => ({
                        key: v.name.trim(),
                        value: v.value.trim(),
                    })),
                }
                : {
                    key: data.name.trim(),
                    value: data.value.trim(),
                }

            const res = await fetch(`${envConfig.variableUrl}/project/${projectId}/create-variable/${envId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const ans = await res.json()
            if (res.status === 200) {
                toast.success(`${ans?.message}`)
            } else {
                toast.error(`${ans?.message || ans?.error}`)
            }
            onaddCallback()
            setLoading(false)
            setDialogOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteVariable = async (varId: string) => {
        setLoading(true)
        try {
            const token = await getToken()
            const res = await fetch(`${envConfig.variableUrl}/projects/${envId}/variable/${varId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await res.json()
            if (res.status === 200) {
                toast.success(`${data?.message}`)
            } else {
                toast.error(`${data?.message || data?.error}`)
            }
            onaddCallback()
            setLoading(false)
            setDialogOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const copyVariable = (key: string, value: string) => {
        const text = `${key}=${value}`
        navigator.clipboard.writeText(text)
        toast.success(`Copied ${key} to clipboard`)
    }

    const copyAllVariables = () => {
        if (!vars.length) {
            toast.error("No variables to copy")
            return
        }
        const text = vars.map((v: any) => `${v.key}=${v.value}`).join("\n")
        navigator.clipboard.writeText(text)
        toast.success("All variables copied to clipboard")
    }

    return (
        <Card className="p-0 overflow-hidden border-border/60 bg-card/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 border-b border-border/60">
                <div className="text-sm text-muted-foreground">{vars.length} variables</div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowValues((s) => !s)}
                        className="justify-center sm:justify-start"
                    >
                        {showValues ? <EyeOff className="size-4 sm:mr-1" /> : <Eye className="size-4 sm:mr-1" />}
                        <span className="ml-1 sm:ml-0">{showValues ? "Hide values" : "Show values"}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAllVariables}
                        className="justify-center sm:justify-start bg-transparent"
                    >
                        <Copy className="size-4 sm:mr-1" />
                        <span className="ml-1 sm:ml-0">Copy All</span>
                    </Button>
                    <ConfirmDialog
                        title="Delete all variables"
                        description={`This will permanently delete all ${vars.length} variables. This action cannot be undone.`}
                        onConfirm={() => deleteVariable("deleteAll")}
                        trigger={
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={loading || vars.length === 0}
                                className="justify-center sm:justify-start text-destructive hover:text-destructive bg-transparent"
                            >
                                <Trash2 className="size-4 sm:mr-1" />
                                <span className="ml-1 sm:ml-0">Delete All</span>
                            </Button>
                        }
                    />
                    <AddVariableDialog
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        loading={loading}
                        onSubmit={(data) => {
                            addVariable(projectId, envId, data)
                        }}
                        trigger={
                            <Button
                                disabled={loading}
                                size="sm"
                                className="gap-2 justify-center sm:justify-start"
                                aria-label="Add Variable"
                            >
                                <Plus className="size-4" />
                                {loading ? "Adding..." : "Add Variable"}
                            </Button>
                        }
                    />
                </div>
            </div>
            <div className="divide-y divide-border/60">
                <div className="hidden md:grid grid-cols-[1fr_1fr_auto] gap-3 px-4 py-2 text-xs text-muted-foreground">
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
                            className="px-3 sm:px-4 py-10 text-center text-muted-foreground"
                        >
                            No variables exist for this environment
                        </motion.div>
                    ) : (
                        vars.map((v: any, index: number) => (
                            <motion.div
                                key={`var-${index}`}
                                layout
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="px-3 sm:px-4 py-3"
                            >
                                <div className="md:hidden space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-muted-foreground mb-1">Key</div>
                                            <code className="text-sm block truncate">{v.key}</code>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-muted-foreground mb-1">Value</div>
                                            <div className="text-sm font-mono text-zinc-300 truncate">
                                                {showValues ? v.value : "••••••••"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/30">
                                        <Button variant="ghost" size="icon" onClick={() => copyVariable(v.key, v.value)}>
                                            <Copy className="size-4" />
                                        </Button>
                                        <EditVariableDialog
                                            defaultName={v.key}
                                            defaultValue={v.value}
                                            varId={v.variableId}
                                            envId={envId}
                                            onaddCallback={onaddCallback}
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="size-4" />
                                            </Button>
                                        </EditVariableDialog>
                                        <ConfirmDialog
                                            title="Delete variable"
                                            description={`Remove variable`}
                                            onConfirm={() => deleteVariable(v.variableId)}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="hidden md:grid grid-cols-[1fr_1fr_auto] items-center gap-3">
                                    <code className="text-sm truncate">{v.key}</code>
                                    <div className="text-sm pl-12 font-mono text-zinc-300 truncate">
                                        {showValues ? v.value : "••••••••"}
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button variant="ghost" size="icon" onClick={() => copyVariable(v.key, v.value)}>
                                            <Copy className="size-4" />
                                        </Button>
                                        <EditVariableDialog
                                            defaultName={v.key}
                                            defaultValue={v.value}
                                            varId={v.variableId}
                                            envId={envId}
                                            onaddCallback={onaddCallback}
                                        >
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="size-4" />
                                            </Button>
                                        </EditVariableDialog>
                                        <ConfirmDialog
                                            title="Delete variable"
                                            description={`Remove variable`}
                                            onConfirm={() => deleteVariable(v.variableId)}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            }
                                        />
                                    </div>
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
    onSubmit: (data: { name: string; value: string } | { name: string; value: string }[]) => void
    open: boolean
    setOpen: (open: boolean) => void
    loading: boolean
}) {
    const [name, setName] = React.useState("")
    const [value, setValue] = React.useState("")
    const [isBulkMode, setIsBulkMode] = React.useState(false)
    const [parsedVariables, setParsedVariables] = React.useState<{ name: string; value: string; error?: string }[]>([])

    const parseVariables = (text: string) => {
        const lines = text.split("\n").filter((line) => line.trim())
        const variables: { name: string; value: string; error?: string }[] = []

        lines.forEach((line) => {
            const trimmedLine = line.trim()
            if (!trimmedLine) return

            const equalIndex = trimmedLine.indexOf("=")
            if (equalIndex === -1) {
                variables.push({
                    name: trimmedLine,
                    value: "",
                    error: "Missing = separator",
                })
                return
            }

            const name = trimmedLine.substring(0, equalIndex).trim()
            const value = trimmedLine.substring(equalIndex + 1).trim()

            if (!name) {
                variables.push({
                    name: "",
                    value: value,
                    error: "Missing variable name",
                })
                return
            }

            variables.push({ name, value })
        })

        return variables
    }

    const handlePaste = (e: React.ClipboardEvent, field: "name" | "value") => {
        const pastedText = e.clipboardData.getData("text")

        if (pastedText.includes("=")) {
            e.preventDefault()

            const lines = pastedText.split("\n").filter((line) => line.trim())

            if (lines.length > 1 || lines[0].split("=").length === 2) {
                setIsBulkMode(true)
                const parsed = parseVariables(pastedText)
                setParsedVariables(parsed)

                if (lines.length === 1) {
                    const [key, val] = lines[0].split("=", 2)
                    setName(key?.trim() || "")
                    setValue(val?.trim() || "")
                }
            }
        }
    }

    useEffect(() => {
        if (!open) {
            setName("")
            setValue("")
            setIsBulkMode(false)
            setParsedVariables([])
        }
    }, [open])

    const handleSubmit = () => {
        if (isBulkMode && parsedVariables.length > 0) {
            const validVariables = parsedVariables.filter((v) => !v.error && v.name && v.value)
            if (validVariables.length > 0) {
                onSubmit(validVariables)
            }
        } else {
            if (!name.trim()) return
            onSubmit({ name: name.trim(), value })
        }
    }

    const validCount = parsedVariables.filter((v) => !v.error && v.name && v.value).length
    const errorCount = parsedVariables.filter((v) => v.error).length

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className={`sm:max-w-md mx-4 sm:mx-0 ${isBulkMode ? "sm:max-w-2xl" : ""}`}>
                <DialogHeader>
                    <DialogTitle>Add Variable{isBulkMode ? "s" : ""}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    {isBulkMode && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Bulk mode activated ({validCount} valid, {errorCount} errors)
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsBulkMode(false)
                                    setParsedVariables([])
                                }}
                            >
                                Switch to Manual
                            </Button>
                        </div>
                    )}

                    {!isBulkMode ? (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="var-name">Key</Label>
                                <Input
                                    id="var-name"
                                    placeholder="API_URL or paste multiple variables and values at once"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onPaste={(e) => handlePaste(e, "name")}
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="var-value">Value</Label>
                                <Input
                                    id="var-value"
                                    placeholder="https://api.example.com or paste multiple variables and values at once"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onPaste={(e) => handlePaste(e, "value")}
                                    disabled={loading}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="grid gap-2">
                            <Label>Preview</Label>
                            <div className="max-h-[200px] overflow-y-auto border rounded-md">
                                {parsedVariables.map((variable, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm border-b last:border-b-0 ${variable.error ? "bg-destructive/10 text-destructive" : "bg-muted/30"
                                            }`}
                                    >
                                        <code className="flex-1 truncate">
                                            {variable.name || "<missing name>"}={variable.value || "<missing value>"}
                                        </code>
                                        {variable.error && <span className="text-xs text-destructive">{variable.error}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || (isBulkMode ? validCount === 0 : !name.trim())}
                        className="w-full sm:w-auto"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isBulkMode ? "Adding..." : "Adding..."}
                            </>
                        ) : isBulkMode ? (
                            `Add ${validCount} Variables`
                        ) : (
                            "Add"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditVariableDialog({ children, defaultName, defaultValue, onSubmit, varId, envId, onaddCallback }: any) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(defaultName)
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        if (open) {
            setName(defaultName)
            setValue(defaultValue)
        }
    }, [open, defaultName, defaultValue])

    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    const handleEdit = async (key: string, value: string) => {
        setLoading(true)
        try {
            if (!key.trim() || !value.trim()) {
                return
            }
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.variableUrl}/projects/${envId}/variable/${varId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ key, value }),
            })

            const data = await res.json()
            if (res.status === 200) {
                toast.success(`${data?.message}`)
            } else {
                toast.error(`${data?.message || data?.error}`)
            }
            onaddCallback()
            setOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="mx-4 sm:mx-0">
                <DialogHeader>
                    <DialogTitle>Edit Variable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input disabled={loading} value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Value</Label>
                        <Input disabled={loading} value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button onClick={() => handleEdit(name, value)} disabled={loading} className="w-full sm:w-auto">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
