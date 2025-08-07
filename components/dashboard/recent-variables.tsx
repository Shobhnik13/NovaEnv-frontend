"use client"

import { useMemo } from "react"
import { useData } from "@/components/data-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentVariables() {
    const { projects } = useData()
    const items = useMemo(() => {
        const vars = projects.flatMap((p) =>
            p.environments.flatMap((e) =>
                e.variables.map((v) => ({
                    id: v.id,
                    name: v.name,
                    value: v.value,
                    updatedAt: v.updatedAt,
                    projectName: p.name,
                    envName: e.name,
                }))
            )
        )
        return vars.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 8)
    }, [projects])

    return (
        <Card className="bg-card/60 border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent variables</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No variables yet.</p>
                ) : (
                    items.map((v) => (
                        <div key={v.id} className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm truncate">
                                    <code className="text-foreground/90">{v.name}</code>
                                    <span className="mx-2 text-muted-foreground">in</span>
                                    <span className="text-muted-foreground">{v.projectName} / {v.envName}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">{new Date(v.updatedAt).toLocaleString()}</p>
                            </div>
                            <span className="text-xs font-mono text-foreground/70">••••••••</span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
