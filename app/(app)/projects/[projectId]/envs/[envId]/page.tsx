"use client"

import { redirect, useParams, useRouter } from "next/navigation"
import { useData } from "@/components/data-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { VariableTable } from "@/components/variable-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import envConfig from "@/envConfig"

export default function EnvironmentPage() {
    const params = useParams<{ projectId: string; envId: string }>()
    const router = useRouter()
    const { getToken } = useAuth()
    const { isSignedIn, user, isLoaded } = useUser()
    const [allLoaded, setAllLoaded] = useState(false)
    const [data, setData] = useState<any>()

    const fetchEnviornment = async () => {
        try {
            const token = await getToken()
            const res = await fetch(`${envConfig.enviornmentUrl}/projects/${params.projectId}/variables/${params.envId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const data = await res.json()
            setData(data)
            setAllLoaded(true)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!isLoaded) return
        if (isLoaded && !isSignedIn) redirect("/sign-in")
        if (!params.envId) {
            router.push("/dashboard")
        }
        fetchEnviornment()
    }, [isLoaded, isSignedIn, params.projectId, getToken])



    if (!allLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6 mt-4">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight"> Enviornment: {data?.name}</h1>
                <p className="text-sm text-muted-foreground">Manage variables for this environment</p>
            </div>
            <VariableTable projectId={params.projectId} vars={data.variables} envId={params.envId} />
        </div>
    )
}
