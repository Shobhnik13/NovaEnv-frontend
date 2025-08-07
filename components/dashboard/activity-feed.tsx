"use client"

import { useData } from "@/components/data-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export function ActivityFeed() {
    const { activity } = useData()
    return (
        <Card className="bg-card/60 border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[280px]">
                    <ul className="divide-y divide-border/60">
                        <AnimatePresence initial={false}>
                            {activity.length === 0 ? (
                                <motion.li
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 text-sm text-muted-foreground"
                                >
                                    No recent activity.
                                </motion.li>
                            ) : (
                                activity.slice(0, 20).map((a) => (
                                    <motion.li
                                        key={a.id}
                                        layout
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="flex items-center justify-between gap-3 px-4 py-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm truncate">{a.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(a.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0">
                                            {a.type.split(".")[0]}
                                        </Badge>
                                    </motion.li>
                                ))
                            )}
                        </AnimatePresence>
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
