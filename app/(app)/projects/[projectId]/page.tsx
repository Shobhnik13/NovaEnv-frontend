"use client"

import { useParams, useRouter } from "next/navigation"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from 'lucide-react'
import { EnvCard } from "@/components/env-card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { AddEnvironmentDialog } from "@/components/add-enviornment-dialog"

export default function ProjectPage() {
    const params = useParams<{ projectId: string }>()
    const router = useRouter()
    const { loading, getProjectById } = useData()
    const project = getProjectById(params.projectId)

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-9 w-48" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-xl bg-zinc-900/50" />
                ))}
            </div>
        </div>
    }

    if (!project) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
                <div className="rounded-xl border border-border/60 bg-card/40 p-8">
                    <p className="text-muted-foreground">Project not found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">{project.description || "Manage your environments"}</p>
                </div>
                <AddEnvironmentDialog projectId={project.id}>
                    <Button className="gap-2">
                        <Plus className="size-4" />
                        Add Environment
                    </Button>
                </AddEnvironmentDialog>
            </div>

            <AnimatePresence mode="popLayout">
                {project.environments.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="grid place-items-center rounded-xl border border-border/60 bg-card/40 p-10 text-center"
                    >
                        <p className="text-muted-foreground">No environments yet.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {project.environments.map((e) => (
                            <EnvCard key={e.id} projectId={project.id} env={e} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
