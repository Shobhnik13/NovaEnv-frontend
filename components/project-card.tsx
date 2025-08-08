"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Boxes } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"
import { AddProjectDialog } from "@/components/add-project-dialog"
import { useData, type Project } from "@/components/data-provider"

export function ProjectCard({ project }: any) {
    const { deleteProject } = useData()
    const envCount = project?.totalEnvironments
    const varCount = project?.totalVariables

    return (
        <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <Card className="group bg-card/60 border-border/60 hover:bg-card/80 transition-colors">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                        <Link href={`/projects/${project.projectId}`} className="hover:underline">
                            {project.name}
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <AddProjectDialog project={project} mode="edit">
                                <Button variant="ghost" size="icon" aria-label="Edit Project">
                                    <Edit className="size-4" />
                                </Button>
                            </AddProjectDialog>

                            <ConfirmDialog
                                title="Delete project"
                                description="This will remove the project and its environments."
                                onConfirm={() => deleteProject(project.id)}
                                trigger={
                                    <Button variant="ghost" size="icon" aria-label="Delete Project" className="text-destructive">
                                        <Trash2 className="size-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{project.description || "-"} </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Boxes className="size-4" /> {envCount} envs</span>
                        <span>•</span>
                        <span>{varCount} variables</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
