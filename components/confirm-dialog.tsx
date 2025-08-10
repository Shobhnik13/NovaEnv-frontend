"use client"

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ConfirmDialog({
    trigger,
    title,
    loading,
    description,
    onConfirm,
}: {
    trigger: React.ReactNode
    title: string,
    loading?: boolean,
    description?: string
    onConfirm: () => void
}) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!loading && open === false) {
            // dialog can close normally now
            setOpen(false)
        }
    }, [loading, open])

    const handleOpenChange = (isOpen: boolean) => {
        // prevent closing when loading is true
        if (loading && !isOpen) return
        setOpen(isOpen)
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
                </AlertDialogHeader>
                <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /></> : "Confirm"}</AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
