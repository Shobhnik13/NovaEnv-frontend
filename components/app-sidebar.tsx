"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Home, LogOut } from 'lucide-react'
import { ConfirmDialog } from "@/components/confirm-dialog"

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="size-8 rounded-lg bg-zinc-900/70 border border-zinc-800 grid place-items-center font-semibold">
                        N
                    </div>
                    <span className="text-sm">NovaEnv</span>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard")}>
                                    <Link href="/dashboard" aria-label="Dashboard">
                                        <Home />
                                        <span>Dashboard</span>
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
                            description="Are you sure you want to sign out? Local demo data will remain on this device."
                            onConfirm={() => {
                                // Simulate logout: navigate home; optional data clear handled elsewhere if needed
                                router.push("/")
                            }}
                            trigger={
                                <SidebarMenuButton aria-label="Logout" tooltip="Logout" asChild>
                                    <button type="button">
                                        <LogOut />
                                        <span>Logout</span>
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
