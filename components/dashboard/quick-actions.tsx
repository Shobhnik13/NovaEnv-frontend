"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Upload, BookOpen } from 'lucide-react'
import { AddProjectDialog } from "@/components/add-project-dialog"

export function QuickActions() {
    return (
        <Card className="bg-card/60 border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <AddProjectDialog>
                    <Button size="sm" className="gap-2">
                        <Plus className="size-4" />
                        New Project
                    </Button>
                </AddProjectDialog>
                <Button size="sm" variant="outline" className="gap-2" aria-label="Import .env (coming soon)" title="Coming soon">
                    <Upload className="size-4" />
                    Import .env
                </Button>
                <Button asChild size="sm" variant="ghost" className="gap-2">
                    <Link href="#features">
                        <BookOpen className="size-4" />
                        Learn more
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
