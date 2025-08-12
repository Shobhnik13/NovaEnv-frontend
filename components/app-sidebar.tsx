"use client"
import Link from "next/link"
import { redirect, usePathname, useRouter } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { CommandIcon, Home, Key, Loader2, LogOut, Terminal, X } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useClerk, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useClerk()
    const [loading, setLoading] = useState(false)
    const { isLoaded, isSignedIn } = useUser()
    const { setOpenMobile } = useSidebar()

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

    const handleLogout = async () => {
        try {
            setLoading(true)
            await signOut()
            setLoading(false)
        } catch (error) {
            console.log("Logout error", error)
        } finally {
            setLoading(false)
        }
    }

    const handleNavClick = () => {
        setOpenMobile(false)
    }

    const handleCloseSidebar = () => {
        setOpenMobile(false)
    }

    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-screen"></div>
    }

    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-zinc-900/70 border border-zinc-800 grid place-items-center font-semibold">
                            N
                        </div>
                        <span className="text-sm">NovaEnv</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden size-8"
                        onClick={handleCloseSidebar}
                        aria-label="Close sidebar"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex flex-col gap-y-">
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard")}>
                                    <Link href="/dashboard" aria-label="Dashboard" onClick={handleNavClick}>
                                        <Home />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/api-key")}>
                                    <Link href="/api-key" aria-label="API Key" onClick={handleNavClick}>
                                        <Key />
                                        <span>API Key</span>
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/api-key")}>
                                    <Link href="/cli" aria-label="CLI Quickstart" onClick={handleNavClick}>
                                        <Terminal/>
                                        <span>CLI Quickstart</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ConfirmDialog
                            title="Sign out"
                            loading={loading}
                            description="Are you sure you want to sign out? "
                            onConfirm={() => handleLogout()}
                            trigger={
                                <SidebarMenuButton aria-label="Logout" tooltip="Logout" asChild>
                                    <button type="button" disabled={loading}>
                                        <LogOut />
                                        <span>
                                            {" "}
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {loading ? "Loging out..." : "Log out"}
                                        </span>
                                    </button>
                                </SidebarMenuButton>
                            }
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
