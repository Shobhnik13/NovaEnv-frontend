"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ListTree } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useData, type Environment } from "@/components/data-provider"
import { AddEnvironmentDialog } from "./add-enviornment-dialog"
import envConfig from "@/envConfig"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

export function EnvCard({ env, projectId, onCreated }: { env: any; projectId: string, onCreated?: () => void }) {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)

    const deleteEnviornment = async (envId: any) => {
        setLoading(true)
        try {
            const token = await getToken()
            if (!token) return

            const res = await fetch(`${envConfig.enviornmentUrl}/projects/enviornments/${envId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res?.ok) {
                onCreated?.()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    // projects/enviornments/:enviornmentId
    return (
        <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <Card className="group bg-card/60 border-border/60 hover:bg-card/80 transition-colors">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                        <Link href={`/projects/${projectId}/envs/${env.enviornmentId}`} className="hover:underline">
                            {env.name}
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <AddEnvironmentDialog onCreated={onCreated} projectId={projectId} env={env} mode="edit">
                                <Button variant="ghost" size="icon" aria-label="Edit Environment">
                                    <Edit className="size-4" />
                                </Button>
                            </AddEnvironmentDialog>
                            <ConfirmDialog
                                loading={loading}
                                title="Delete environment"
                                description="This will remove the environment and its variables."
                                onConfirm={() => deleteEnviornment(env.enviornmentId)}
                                trigger={
                                    <Button disabled={loading} variant="ghost" size="icon" aria-label="Delete Environment" className="text-destructive">
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
