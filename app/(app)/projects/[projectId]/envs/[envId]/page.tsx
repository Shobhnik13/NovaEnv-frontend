"use client"

import { redirect, useParams, useRouter } from "next/navigation"
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

    const fetchEnviornment = async (silent = false) => {
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
            if (silent === false) setAllLoaded(true)
        } catch (error) {
            console.log(error);
        } finally {
            setAllLoaded(true)
        }
    }
    useEffect(() => {
        if (!params.envId) {
            router.push("/dashboard")
        }
        fetchEnviornment()
    }, [params.projectId, getToken])



    if (!allLoaded || !isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6 mt-4">
             <div className="flex items-center gap-2">
                    <ArrowLeft
                        className="size-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        onClick={() => router.back()}
                    />
                    <div>
                        <h1 className="text-base md:text-2xl font-semibold tracking-tight">{data.name}</h1>
                        <p className="text-sm text-muted-foreground">{data.description || "Manage your secrets"}</p>
                    </div>
                </div>
            <VariableTable onaddCallback={() => fetchEnviornment(true)} key={params.envId} projectId={params.projectId} vars={data.variables} envId={params.envId} />
        </div>
    )
}
