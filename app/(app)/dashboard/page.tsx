"use client"

import { useEffect, useMemo } from "react"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { Plus, ActivityIcon, Box, ListTree, Loader2 } from 'lucide-react'
import { ProjectCard } from "@/components/project-card"
import { Skeleton } from "@/components/ui/skeleton"
import { AddProjectDialog } from "@/components/add-project-dialog"
import { motion } from "framer-motion"
import { AnimatedStat } from "@/components/dashboard/animated-stat"
import { Sparkline } from "@/components/dashboard/sparkline"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentVariables } from "@/components/dashboard/recent-variables"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

function makeSpark(seed: number, len = 16) {
    // simple deterministic generator
    let x = seed
    const out: number[] = []
    for (let i = 0; i < len; i++) {
        x = (x * 9301 + 49297) % 233280
        out.push(5 + (x / 233280) * 95)
    }
    return out
}

export default function DashboardPage() {
    const { loading, projects, activity } = useData()
    const { isSignedIn, user, isLoaded } = useUser()

    useEffect(() => {
        const checkProtect = () => {
            if (!isLoaded) {
                return (
                    <div className="flex items-center justify-center min-h-screen bg-gray-50">
                        <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
                    </div>
                )
            }
            if (isLoaded && !isSignedIn) {
                redirect("/sign-in")
            }
        }
        checkProtect()
    }, [isLoaded, isSignedIn])
    const envCount = useMemo(
        () => projects.reduce((acc, p) => acc + p.environments.length, 0),
        [projects]
    )
    const varCount = useMemo(
        () => projects.reduce((acc, p) => acc + p.environments.reduce((a, e) => a + e.variables.length, 0), 0),
        [projects]
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mt-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                    <p className="text-sm text-muted-foreground">Overview of your projects and secrets</p>
                </div>
                <AddProjectDialog>
                    <Button className="gap-2" aria-label="Add Project">
                        <Plus className="size-4" />
                        Add Project
                    </Button>
                </AddProjectDialog>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatedStat
                    title="Projects"
                    value={projects.length}
                    icon={<Box className="size-4" />}
                    sparkline={<Sparkline points={makeSpark(1)} />}
                />
                <AnimatedStat
                    title="Environments"
                    value={envCount}
                    icon={<ListTree className="size-4" />}
                    sparkline={<Sparkline points={makeSpark(2)} />}
                />
                <AnimatedStat
                    title="Variables"
                    value={varCount}
                    icon={<span className="text-xs font-mono">.env</span>}
                    sparkline={<Sparkline points={makeSpark(3)} />}
                />

            </div>

            {/* Main grid: dense layout */}
            {loading ? (
                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-36 rounded-xl bg-zinc-900/50" />
                        ))}
                    </div>
                    <div className="lg:col-span-4 space-y-4">
                        <Skeleton className="h-28 rounded-xl bg-zinc-900/50" />
                        <Skeleton className="h-72 rounded-xl bg-zinc-900/50" />
                        <Skeleton className="h-72 rounded-xl bg-zinc-900/50" />
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-4 lg:grid-cols-12"
                >
                    {/* Projects grid */}
                    <div className="lg:col-span-8">
                        {projects.length === 0 ? (
                            <div className="grid place-items-center rounded-xl border border-border/60 bg-card/40 p-10 text-center text-muted-foreground">
                                No projects yet. Create your first one to get started.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-y-3">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight">Your projects</h1>
                                    <p className="text-sm text-muted-foreground">Manage your products and secrets</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {projects.map((p) => (
                                        <ProjectCard key={p.id} project={p} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                </motion.div>
            )}
        </div>
    )
}
