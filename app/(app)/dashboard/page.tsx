"use client"

import { useEffect, useState, useMemo } from "react"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { Plus, Box, ListTree, Loader2 } from 'lucide-react'
import { ProjectCard } from "@/components/project-card"
import { AddProjectDialog } from "@/components/add-project-dialog"
import { motion } from "framer-motion"
import { AnimatedStat } from "@/components/dashboard/animated-stat"
import { Sparkline } from "@/components/dashboard/sparkline"
import { useAuth, useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import envConfig from "@/envConfig"

function makeSpark(seed: number, len = 16) {
    let x = seed
    const out: number[] = []
    for (let i = 0; i < len; i++) {
        x = (x * 9301 + 49297) % 233280
        out.push(5 + (x / 233280) * 95)
    }
    return out
}

export default function DashboardPage() {
    const { isSignedIn, user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const [allLoaded, setAllLoaded] = useState(false)
    const [analyticsData, setAnalyticsData] = useState({
        projects: 0,
        enviornments: 0,
        variables: 0,
    })
    const [projects, setProjects] = useState<any>([])
    useEffect(() => {
        if (!isLoaded) return
        if (isLoaded && !isSignedIn) redirect("/sign-in")

        const fetchAll = async () => {
            try {
                const token = await getToken()

                const requests = [
                    fetch(`${envConfig.authUrl}/me`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            email: user?.primaryEmailAddress?.emailAddress,
                        }),
                    }),

                    fetch(`${envConfig.projectUrl}/projects`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }),

                    fetch(`${envConfig.projectUrl}/analytics`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }),
                ]

                const responses = await Promise.all(requests)
                const data = await Promise.all(responses.map(r => r.json()))

                if (data[0]) {
                    setProjects(data[1])
                    setAnalyticsData(data[2])
                }

                console.log(projects);
                

                setAllLoaded(true)
            } catch (err) {
                console.error("Error loading dashboard data", err)
            }
        }

        fetchAll()
    }, [isLoaded, isSignedIn, user, getToken])


    if (!allLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
            </div>
        )
    }
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
                    value={analyticsData?.projects || 0}
                    icon={<Box className="size-4" />}
                    sparkline={<Sparkline points={makeSpark(1)} />}
                />
                <AnimatedStat
                    title="Environments"
                    value={analyticsData?.enviornments || 0}
                    icon={<ListTree className="size-4" />}
                    sparkline={<Sparkline points={makeSpark(2)} />}
                />
                <AnimatedStat
                    title="Variables"
                    value={analyticsData?.variables || 0}
                    icon={<span className="text-xs font-mono">.env</span>}
                    sparkline={<Sparkline points={makeSpark(3)} />}
                />
            </div>

            {/* Main grid */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid gap-4 "
            >
                <div className="lg:col-span-8">
                    {projects.length === 0 ? (
                        <div className="grid place-items-center rounded-xl border border-border/60 bg-card/40 p-10 text-center text-muted-foreground">
                            No projects yet. Create your first one to get started.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-y-3">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Your projects</h1>
                                <p className="text-sm text-muted-foreground">Manage your projects and secrets</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3 3xl:grid-cols-4">
                                {projects.length>0 && projects.map((p:any) => (
                                        <ProjectCard key={p?.projectId} project={p} />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
