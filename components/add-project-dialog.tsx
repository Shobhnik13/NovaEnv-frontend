"use client"

import React from "react"
import { useData, type Project } from "@/components/data-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function AddProjectDialog({
    children,
    project,
    mode = "create",
}: {
    children?: React.ReactNode
    project?: Project
    mode?: "create" | "edit"
}) {
    const [open, setOpen] = React.useState(false)
    const { addProject, updateProject } = useData()
    const [name, setName] = React.useState(project?.name ?? "")
    const [desc, setDesc] = React.useState(project?.description ?? "")

    React.useEffect(() => {
        if (open && project) {
            setName(project.name)
            setDesc(project.description ?? "")
        }
    }, [open, project])

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
                        <Input id="proj-name" placeholder="My App" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="proj-desc">Description</Label>
                        <Input id="proj-desc" placeholder="Optional" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            if (!name.trim()) return
                            if (mode === "edit" && project) {
                                updateProject(project.id, { name: name.trim(), description: desc })
                            } else {
                                addProject({ name: name.trim(), description: desc })
                            }
                            setOpen(false)
                            setName("")
                            setDesc("")
                        }}
                    >
                        {mode === "edit" ? "Save" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
