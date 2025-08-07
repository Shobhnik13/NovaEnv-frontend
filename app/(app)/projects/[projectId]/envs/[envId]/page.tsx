"use client"

import { useParams, useRouter } from "next/navigation"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { VariableTable } from "@/components/variable-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function EnvironmentPage() {
    const params = useParams<{ projectId: string; envId: string }>()
    const router = useRouter()
    const { loading, getProjectById } = useData()
    const project = getProjectById(params.projectId)
    const env = project?.environments.find((e) => e.id === params.envId)

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!project || !env) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="size-4" />
                    Back
                </Button>
                <div className="rounded-xl border border-border/60 bg-card/40 p-8">
                    <p className="text-muted-foreground">Environment not found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">{project.name} / {env.name}</h1>
                <p className="text-sm text-muted-foreground">Manage variables for this environment</p>
            </div>
            <VariableTable projectId={project.id} envId={env.id} />
        </div>
    )
}
