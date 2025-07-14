import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/hooks/useLanguage"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
    const { languageData } = useLanguage()
    const [currentPage, setCurrentPage] = useState("Welcome")

    useEffect(() => {
        const updateCurrentPage = () => {
            const hash = window.location.hash.replace('#', '')
            if (hash && languageData) {
                for (const section of Object.values(languageData.sidebar.sections)) {
                    if (section.items && section.items[hash]) {
                        setCurrentPage(section.items[hash])
                        return
                    }
                }
            }
            setCurrentPage(languageData?.ui?.breadcrumb?.current || "Welcome")
        }

        updateCurrentPage()
        window.addEventListener('hashchange', updateCurrentPage)

        return () => {
            window.removeEventListener('hashchange', updateCurrentPage)
        }
    }, [languageData])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    {languageData?.ui?.breadcrumb?.home || <Skeleton className="h-4 w-24" />}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {currentPage}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">
                                {languageData?.ui?.welcome?.title || <Skeleton className="h-10 w-80 mx-auto" />}
                            </h1>
                            <div className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {languageData?.ui?.welcome?.subtitle || <Skeleton className="h-6 w-96 mx-auto" />}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
