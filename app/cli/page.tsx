"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    ArrowLeft,
    Copy,
    Terminal,
    Download,
    Key,
    FolderOpen,
    Globe,
    FileText,
    LogOut,
    User,
    HelpCircle,
    CheckCircle,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CLIPage() {
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

    const copyToClipboard = (text: string, command: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCommand(command)
        toast.success(`Copied ${command} to clipboard`)
        setTimeout(() => setCopiedCommand(null), 2000)
    }

    const commands = [
        {
            name: "login",
            icon: Key,
            description: "Authenticate with your API key",
            usage: "novaenv-cli login",
            example: "Enter your API key when prompted",
        },
        {
            name: "projects",
            icon: FolderOpen,
            description: "List projects, select environment, and extract variables",
            usage: "novaenv-cli projects",
            example: "Interactive selection of project → environment → .env creation",
        },
        {
            name: "whoami",
            icon: User,
            description: "Show current logged in user information",
            usage: "novaenv-cli whoami",
            example: "Displays your API key and email",
        },
        {
            name: "logout",
            icon: LogOut,
            description: "Logout and clear stored credentials",
            usage: "novaenv-cli logout",
            example: "Removes stored API key and user data",
        },
        {
            name: "help",
            icon: HelpCircle,
            description: "Show help message with all available commands",
            usage: "novaenv-cli help",
            example: "Display usage instructions and command list",
        },
    ]

    const router = useRouter()
    return (
        <main className="relative min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <Button variant="ghost"  className="mb-4 sm:mb-6" onClick={() => router.back()}>
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight mb-3 sm:mb-4">
                            <span className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#fafafa_0%,#bdbdbf_22%,#8a8a90_48%,#f1f1f2_70%,#9a9aa0_88%,#fafafa_100%)]">
                                NovaEnv CLI
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl">
                            Command-line interface for managing environment variables across your projects. Extract, sync, and deploy
                            your environment configurations with ease.
                        </p>
                    </motion.div>
                </div>

                {/* Installation */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8 sm:mb-12"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Download className="size-5 sm:size-6" />
                        Installation
                    </h2>
                    <Card className="p-4 sm:p-6 bg-card/60 border-border/60">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="font-mono text-sm sm:text-base lg:text-lg break-all">npm install -g novaenv-cli</div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard("npm install -g novaenv-cli", "install")}
                                className="gap-2 w-full sm:w-auto"
                            >
                                {copiedCommand === "install" ? (
                                    <CheckCircle className="size-4 text-green-500" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                                {copiedCommand === "install" ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    </Card>
                </motion.section>

                {/* Quick Start */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8 sm:mb-12"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Terminal className="size-5 sm:size-6" />
                        Quick Start
                    </h2>
                    <div className="grid gap-3 sm:gap-4">
                        {[
                            { step: "1", command: "novaenv-cli login", description: "Login with your API key from the dashboard" },
                            {
                                step: "2",
                                command: "novaenv-cli projects",
                                description: "Select project and environment to extract variables",
                            },
                            { step: "3", command: "You are all set", description: "Your .env file is ready in the current directory!" },
                        ].map((item, index) => (
                            <Card key={index} className="p-3 sm:p-4 bg-card/40 border-border/60">
                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-mono text-xs sm:text-sm text-zinc-300 mb-1 break-all">{item.command}</div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">{item.description}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Commands */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8 sm:mb-12"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">Available Commands</h2>
                    <div className="grid gap-3 sm:gap-4">
                        {commands.map((command, index) => (
                            <Card key={command.name} className="p-4 sm:p-6 bg-card/40 border-border/60">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                                        <command.icon className="size-4 sm:size-5 text-zinc-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                            <h3 className="font-semibold text-base sm:text-lg">{command.name}</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyToClipboard(command.usage, command.name)}
                                                className="gap-2 h-6 sm:h-7 text-xs w-fit"
                                            >
                                                {copiedCommand === command.name ? (
                                                    <CheckCircle className="size-3 text-green-500" />
                                                ) : (
                                                    <Copy className="size-3" />
                                                )}
                                                {copiedCommand === command.name ? "Copied!" : "Copy"}
                                            </Button>
                                        </div>
                                        <p className="text-sm sm:text-base text-muted-foreground mb-3">{command.description}</p>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Usage</span>
                                                <div className="font-mono text-xs sm:text-sm bg-zinc-900/50 rounded px-2 py-1 mt-1 break-all overflow-x-auto">
                                                    {command.usage}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Example</span>
                                                <div className="text-xs sm:text-sm text-zinc-300 mt-1">{command.example}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Workflow */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-8 sm:mb-12"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Globe className="size-5 sm:size-6" />
                        Typical Workflow
                    </h2>
                    <Card className="p-4 sm:p-6 bg-card/40 border-border/60">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></div>
                                </div>
                                <span className="text-sm sm:text-base">
                                    Run <code className="bg-zinc-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">novaenv-cli login</code> and enter your
                                    API key
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-sm sm:text-base">
                                    Execute <code className="bg-zinc-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm break-all">novaenv-cli projects</code> to see
                                    your projects
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
                                </div>
                                <span className="text-sm sm:text-base">Select a project by entering its number</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-500"></div>
                                </div>
                                <span className="text-sm sm:text-base">Choose an environment present in that project</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                                </div>
                                <span className="text-sm sm:text-base">
                                    Variables are extracted and saved to{" "}
                                    <code className="bg-zinc-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">.env</code> file
                                </span>
                            </div>
                        </div>
                    </Card>
                </motion.section>

                {/* Features */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <FileText className="size-5 sm:size-6" />
                        Features
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            "🔐 Secure API key authentication",
                            "📂 Interactive project selection",
                            "🌍 Environment-specific variable extraction",
                            "📝 Automatic .env file generation",
                            "🔄 Overwrite protection for existing files",
                            "🛡️ End-to-end encrypted data transfer",
                        ].map((feature, index) => (
                            <Card key={index} className="p-3 sm:p-4 bg-card/20 border-border/60">
                                <span className="text-xs sm:text-sm">{feature}</span>
                            </Card>
                        ))}
                    </div>
                </motion.section>
            </div>
        </main>
    )
}
