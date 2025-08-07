"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AnimatedStat({
    title,
    value,
    icon,
    sparkline,
    className,
}: {
    title: string
    value: number
    icon?: React.ReactNode
    sparkline?: React.ReactNode
    className?: string
}) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())

    React.useEffect(() => {
        const controls = animate(count, value, { duration: 0.8, ease: "easeOut" })
        return controls.stop
    }, [value, count])

    return (
        <Card className={cn("relative overflow-hidden bg-card/60 border-border/60 hover:bg-card/80 transition-colors", className)}>
            <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{title}</span>
                    {icon ? <div className="text-foreground/80">{icon}</div> : null}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
                <div className="flex items-end justify-between">
                    <motion.div className="text-2xl font-semibold tabular-nums">{rounded}</motion.div>
                    <div className="ml-3 h-10 w-24 md:w-28">{sparkline}</div>
                </div>
            </CardContent>
            {/* sheen */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
        </Card>
    )
}
