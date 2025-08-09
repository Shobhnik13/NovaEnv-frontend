"use client"

import { redirect, useParams, useRouter } from "next/navigation"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import { EnvCard } from "@/components/env-card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { AddEnvironmentDialog } from "@/components/add-enviornment-dialog"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import envConfig from "@/envConfig"

export default function ProjectPage() {
    const params = useParams<{ projectId: string }>()
    const router = useRouter()
    const { getToken } = useAuth()
    const { isSignedIn, user, isLoaded } = useUser()
    const [allLoaded, setAllLoaded] = useState(false)
    const [project, setProject] = useState<any>(null)

    const fetchProject = async (silent=false) => {
        try {
            const token = await getToken()
            const res = await fetch(`${envConfig.projectUrl}/projects/${params.projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setProject(data)
            setAllLoaded(true)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!isLoaded) return
        if (isLoaded && !isSignedIn) redirect("/sign-in")
        if (!params.projectId) {
            router.push("/dashboard")
        }
        fetchProject()
    }, [isLoaded, isSignedIn, params.projectId, getToken])

    if (!allLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
            </div>
        )
    }

    if (!project || project === null) {
        return (
            <div className="space-y-4 mt-4">
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
        <div className="space-y-6 mt-4 ">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Project: {project.name}</h1>
                    <p className="text-sm text-muted-foreground">{project.description || "Manage your environments"}</p>
                </div>
                <AddEnvironmentDialog projectId={project.projectId} onCreated = {()=>fetchProject(true)}>
                    <Button className="gap-2">
                        <Plus className="size-4" />
                        Add Environment
                    </Button>
                </AddEnvironmentDialog>
            </div>

            <AnimatePresence mode="popLayout">
                {project.envs.length === 0 ? (
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
                        {project.envs.map((e: any) => (
                            <EnvCard key={e.name} projectId={project.projectId} env={e} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
