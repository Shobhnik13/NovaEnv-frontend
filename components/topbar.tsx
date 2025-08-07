"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'

export function Topbar() {
    return (
        <div className="sticky top-0 z-30 flex items-center justify-between bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60 px-4 md:px-6 py-3">
            <div className="text-sm text-muted-foreground">
                Press Cmd/Ctrl + B to toggle sidebar
            </div>
            <div className="flex items-center gap-2">
               
                <Avatar className="size-8">
                    <AvatarFallback>N</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
