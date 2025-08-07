"use client"

import React from "react"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

export type Variable = {
    id: string
    name: string
    value: string
    createdAt: number
    updatedAt: number
}
export type Environment = {
    id: string
    name: string
    variables: Variable[]
    updatedAt: number
}
export type Project = {
    id: string
    name: string
    description?: string
    environments: Environment[]
}

export type ActivityItem = {
    id: string
    type:
    | "project.created"
    | "project.updated"
    | "project.deleted"
    | "env.created"
    | "env.updated"
    | "env.deleted"
    | "var.created"
    | "var.updated"
    | "var.deleted"
    message: string
    timestamp: number
}

type DataContext = {
    loading: boolean
    projects: Project[]
    activity: ActivityItem[]
    addProject: (input?: Partial<Project>) => Project
    updateProject: (id: string, patch: Partial<Project>) => void
    deleteProject: (id: string) => void
    addEnvironment: (projectId: string, name: string) => Environment | null
    updateEnvironment: (projectId: string, envId: string, patch: Partial<Environment>) => void
    deleteEnvironment: (projectId: string, envId: string) => void
    addVariable: (projectId: string, envId: string, input: { name: string; value: string }) => Variable | null
    updateVariable: (projectId: string, envId: string, varId: string, patch: Partial<Variable>) => void
    deleteVariable: (projectId: string, envId: string, varId: string) => void
    getProjectById: (id?: string) => Project | undefined
}

const Ctx = React.createContext<DataContext | null>(null)

const STORAGE_KEY = "novaenv:data:v1"
const ACTIVITY_KEY = "novaenv:activity:v1"

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = React.useState(true)
    const [projects, setProjects] = React.useState<Project[]>([])
    const [activity, setActivity] = React.useState<ActivityItem[]>([])
    const router = useRouter()

    // Load from localStorage
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            const act = localStorage.getItem(ACTIVITY_KEY)
            if (raw) {
                setProjects(JSON.parse(raw))
            } else {
                // Seed with an example
                const seed: Project[] = [
                    {
                        id: nanoid(),
                        name: "Nova API",
                        description: "Public API",
                        environments: [
                            {
                                id: nanoid(),
                                name: "Development",
                                updatedAt: Date.now(),
                                variables: [
                                    { id: nanoid(), name: "API_URL", value: "http://localhost:3000", createdAt: Date.now(), updatedAt: Date.now() },
                                    { id: nanoid(), name: "NEXT_PUBLIC_SITE_NAME", value: "Nova", createdAt: Date.now(), updatedAt: Date.now() },
                                ],
                            },
                            {
                                id: nanoid(),
                                name: "Production",
                                updatedAt: Date.now(),
                                variables: [
                                    { id: nanoid(), name: "API_URL", value: "https://api.example.com", createdAt: Date.now(), updatedAt: Date.now() },
                                ],
                            },
                        ],
                    },
                ]
                setProjects(seed)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
            }
            if (act) {
                setActivity(JSON.parse(act))
            }
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }, [])

    // Persist helpers
    const persistProjects = React.useCallback((next: Project[]) => {
        setProjects(next)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch { }
    }, [])

    const pushActivity = React.useCallback((item: ActivityItem) => {
        setActivity((prev) => {
            const next = [item, ...prev].slice(0, 200) // cap
            try {
                localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next))
            } catch { }
            return next
        })
    }, [])

    // Actions
    const addProject: DataContext["addProject"] = (input) => {
        const project: Project = {
            id: nanoid(),
            name: input?.name || "New Project",
            description: input?.description || "",
            environments: [],
        }
        const next = [project, ...projects]
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "project.created",
            message: `Project created: ${project.name}`,
            timestamp: Date.now(),
        })
        return project
    }

    const updateProject: DataContext["updateProject"] = (id, patch) => {
        const before = projects.find((p) => p.id === id)
        persistProjects(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)))
        pushActivity({
            id: nanoid(),
            type: "project.updated",
            message: `Project updated: ${before?.name ?? id}`,
            timestamp: Date.now(),
        })
    }

    const deleteProject: DataContext["deleteProject"] = (id) => {
        const before = projects.find((p) => p.id === id)
        persistProjects(projects.filter((p) => p.id !== id))
        pushActivity({
            id: nanoid(),
            type: "project.deleted",
            message: `Project deleted: ${before?.name ?? id}`,
            timestamp: Date.now(),
        })
        if (window.location.pathname.includes(`/projects/${id}`)) {
            router.push("/dashboard")
        }
    }

    const addEnvironment: DataContext["addEnvironment"] = (projectId, name) => {
        const env: Environment = { id: nanoid(), name, variables: [], updatedAt: Date.now() }
        const next = projects.map((p) => (p.id === projectId ? { ...p, environments: [env, ...p.environments] } : p))
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "env.created",
            message: `Environment created: ${name}`,
            timestamp: Date.now(),
        })
        return env
    }

    const updateEnvironment: DataContext["updateEnvironment"] = (projectId, envId, patch) => {
        let envName = envId
        const next = projects.map((p) =>
            p.id === projectId
                ? {
                    ...p,
                    environments: p.environments.map((e) => {
                        if (e.id === envId) {
                            envName = e.name
                            return { ...e, ...patch, updatedAt: Date.now() }
                        }
                        return e
                    }),
                }
                : p
        )
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "env.updated",
            message: `Environment updated: ${envName}`,
            timestamp: Date.now(),
        })
    }

    const deleteEnvironment: DataContext["deleteEnvironment"] = (projectId, envId) => {
        let envName = envId
        const proj = projects.find((p) => p.id === projectId)
        const target = proj?.environments.find((e) => e.id === envId)
        if (target) envName = target.name
        const next = projects.map((p) =>
            p.id === projectId ? { ...p, environments: p.environments.filter((e) => e.id !== envId) } : p
        )
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "env.deleted",
            message: `Environment deleted: ${envName}`,
            timestamp: Date.now(),
        })
        if (window.location.pathname.includes(`/projects/${projectId}/envs/${envId}`)) {
            router.push(`/projects/${projectId}`)
        }
    }

    const addVariable: DataContext["addVariable"] = (projectId, envId, input) => {
        const now = Date.now()
        const variable: Variable = { id: nanoid(), name: input.name, value: input.value, createdAt: now, updatedAt: now }
        const next = projects.map((p) =>
            p.id === projectId
                ? {
                    ...p,
                    environments: p.environments.map((e) =>
                        e.id === envId ? { ...e, variables: [variable, ...e.variables], updatedAt: now } : e
                    ),
                }
                : p
        )
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "var.created",
            message: `Variable added: ${variable.name}`,
            timestamp: now,
        })
        return variable
    }

    const updateVariable: DataContext["updateVariable"] = (projectId, envId, varId, patch) => {
        const now = Date.now()
        let varName = varId
        const next = projects.map((p) =>
            p.id === projectId
                ? {
                    ...p,
                    environments: p.environments.map((e) =>
                        e.id === envId
                            ? {
                                ...e,
                                variables: e.variables.map((v) => {
                                    if (v.id === varId) {
                                        varName = v.name
                                        return { ...v, ...patch, updatedAt: now }
                                    }
                                    return v
                                }),
                                updatedAt: now,
                            }
                            : e
                    ),
                }
                : p
        )
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "var.updated",
            message: `Variable updated: ${varName}`,
            timestamp: now,
        })
    }

    const deleteVariable: DataContext["deleteVariable"] = (projectId, envId, varId) => {
        const now = Date.now()
        let varName = varId
        const next = projects.map((p) =>
            p.id === projectId
                ? {
                    ...p,
                    environments: p.environments.map((e) => {
                        if (e.id === envId) {
                            const target = e.variables.find((v) => v.id === varId)
                            if (target) varName = target.name
                            return { ...e, variables: e.variables.filter((v) => v.id !== varId), updatedAt: now }
                        }
                        return e
                    }),
                }
                : p
        )
        persistProjects(next)
        pushActivity({
            id: nanoid(),
            type: "var.deleted",
            message: `Variable deleted: ${varName}`,
            timestamp: now,
        })
    }

    const getProjectById: DataContext["getProjectById"] = (id) => projects.find((p) => p.id === id)

    const value: DataContext = {
        loading,
        projects,
        activity,
        addProject,
        updateProject,
        deleteProject,
        addEnvironment,
        updateEnvironment,
        deleteEnvironment,
        addVariable,
        updateVariable,
        deleteVariable,
        getProjectById,
    }

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useData(): DataContext {
    const ctx = React.useContext(Ctx)
    if (!ctx) throw new Error("useData must be used within DataProvider")
    return ctx
}
