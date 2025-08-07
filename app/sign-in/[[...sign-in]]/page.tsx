'use client'
import { SignIn, useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const checkProtect = () => {
            if (!isLoaded) {
                return (
                    <div className="flex items-center justify-center min-h-screen bg-gray-50">
                        <Loader2 className="h-30 w-10 animate-spin text-gray-600" />
                    </div>
                )
            }
            if (isLoaded && isSignedIn) {
                redirect("/dashboard")
            }
        }
        checkProtect()
    }, [isLoaded, isSignedIn])
    return <SignIn />
}