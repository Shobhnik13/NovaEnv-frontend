"use client"

import React, { useEffect, useState } from "react"
import { useData, type Project } from "@/components/data-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import envConfig from "@/envConfig"
import { Loader2 } from "lucide-react" // Spinner icon

export function AddProjectDialog({
    children,
    project,
    mode = "create",
    onCreated,
    onEdited
}: {
    children?: React.ReactNode
    project?: any
    mode?: "create" | "edit",
    onCreated?: () => void,
    onEdited?: () => void
}) {
    const [open, setOpen] = useState(false)
    const { addProject, updateProject } = useData()
    const [name, setName] = useState(project?.name ?? "")
    const [desc, setDesc] = useState(project?.description ?? "")
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()

    useEffect(() => {
        if (open && project) {
            setName(project.name)
            setDesc(project.description ?? "")
        }
    }, [open, project])

    const handleSubmit = async (name: string, description: string) => {
        setLoading(true)
        try {
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.projectUrl}/create-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            })

            const data = await res.json()
            setOpen(false)
            setName("")
            setDesc("")
            onCreated?.()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (name: string, description: string, projectId: any) => {
        setLoading(true)
        try {
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.projectUrl}/projects/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            })

            const data = await res.json()
            setOpen(false)
            setName("")
            setDesc("")
            onEdited?.()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? <Button>Add Project</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Project" : "Add Project"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="proj-name">Name</Label>
                        <Input
                            id="proj-name"
                            placeholder="My App"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading} // Prevent editing while loading
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="proj-desc">Description</Label>
                        <Input
                            id="proj-desc"
                            placeholder="Optional"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        disabled={loading || !name.trim()}
                        onClick={() => {
                            if (!name.trim()) return
                            if (mode === "edit" && project) {
                                handleEdit(name.trim(), desc.trim(), project?.projectId)
                            } else {
                                handleSubmit(name.trim(), desc)
                            } 
                        }}
                    >
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
