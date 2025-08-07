"use client"

import { motion } from "framer-motion"
import * as React from "react"

export function Sparkline({
    points,
    stroke = "hsl(0 0% 98% / 0.8)",
}: {
    points: number[]
    stroke?: string
}) {
    const width = 120
    const height = 40
    const padding = 4
    const min = Math.min(...points)
    const max = Math.max(...points)
    const range = Math.max(1, max - min)

    const path = points
        .map((p, i) => {
            const x = padding + (i / (points.length - 1)) * (width - padding * 2)
            const y = height - padding - ((p - min) / range) * (height - padding * 2)
            return `${i === 0 ? "M" : "L"} ${x},${y}`
        })
        .join(" ")

    return (
        <motion.svg
            viewBox={`0 0 ${width} ${height}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <defs>
                <linearGradient id="spark" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgba(250,250,250,0.8)" />
                    <stop offset="100%" stopColor="rgba(156,156,163,0.8)" />
                </linearGradient>
            </defs>
            <path d={path} fill="none" stroke="url(#spark)" strokeWidth={2} strokeLinecap="round" />
        </motion.svg>
    )
}
