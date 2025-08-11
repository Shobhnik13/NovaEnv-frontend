"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export function Topbar() {
    const { user } = useUser()
    const { isLoaded, isSignedIn } = useUser()

    useEffect(() => {
        const checkProtect = () => {
            if (!isLoaded) {
                return (
                    <div className="flex items-center justify-center min-h-screen bg-gray-50">
                        <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
                    </div>
                )
            }
            if (isLoaded && !isSignedIn) {
                redirect("/sign-in")
            }
        }
        checkProtect()
    }, [isLoaded, isSignedIn])

    if (!isLoaded) {
        return
    }

    return (
        <div className="sticky top-0 z-30 flex items-center justify-between bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60 px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <div className="text-sm text-muted-foreground hidden md:block">Press Cmd/Ctrl + B to toggle sidebar</div>
                <div className="text-sm font-medium md:hidden">NovaEnv</div>
            </div>
            <div className="flex items-center gap-2">
                <Avatar className="size-8">
                    <AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
