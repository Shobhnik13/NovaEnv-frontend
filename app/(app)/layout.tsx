import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Topbar } from "@/components/topbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider /* defaultOpen restored by cookie internally per shadcn impl */>
            <AppSidebar />
            <SidebarInset className="bg-background">
                <Topbar />
                    <div className="px-4 md:px-6 pb-10">
                        {children}
                    </div>
            </SidebarInset>
            {/* Optional floating trigger for mobile when sidebar hidden */}
            {/* <div className="fixed bottom-4 left-4 z-40 md:hidden">
                <SidebarTrigger aria-label="Toggle sidebar" />
            </div> */}
        </SidebarProvider>
    )
}
