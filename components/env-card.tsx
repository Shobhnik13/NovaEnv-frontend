"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ListTree } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useData, type Environment } from "@/components/data-provider"
import { AddEnvironmentDialog } from "./add-enviornment-dialog"

export function EnvCard({ env, projectId }: { env: Environment; projectId: string }) {
    const { deleteEnvironment } = useData()
    return (
        <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <Card className="group bg-card/60 border-border/60 hover:bg-card/80 transition-colors">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                        <Link href={`/projects/${projectId}/envs/${env.id}`} className="hover:underline">
                            {env.name}
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <AddEnvironmentDialog projectId={projectId} env={env} mode="edit">
                                <Button variant="ghost" size="icon" aria-label="Edit Environment">
                                    <Edit className="size-4" />
                                </Button>
                            </AddEnvironmentDialog>
                            <ConfirmDialog
                                title="Delete environment"
                                description="This will remove the environment and its variables."
                                onConfirm={() => deleteEnvironment(projectId, env.id)}
                                trigger={
                                    <Button variant="ghost" size="icon" aria-label="Delete Environment" className="text-destructive">
                                        <Trash2 className="size-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </CardTitle>
                    <CardDescription>Last updated {new Date(env.updatedAt).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {/* <span className="inline-flex items-center gap-1"><ListTree className="size-4" /> {env.variables.length} variables</span> */}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
