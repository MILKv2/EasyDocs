import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/hooks/useLanguage"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentRenderer } from "@/components/content-renderer"
import { Landing } from "@/components/docs/landing"
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
    const [currentContentKey, setCurrentContentKey] = useState<string | null>(null)

    useEffect(() => {
        const updateCurrentPage = () => {
            const hash = window.location.hash.replace('#', '')
            if (hash && languageData && languageData.sidebar && languageData.sidebar.sections) {
                for (const section of Object.values(languageData.sidebar.sections)) {
                    if (section && typeof section === 'object' && 'items' in section) {
                        const sectionWithItems = section as { items: { [key: string]: string } }
                        if (sectionWithItems.items && sectionWithItems.items[hash]) {
                            setCurrentPage(sectionWithItems.items[hash])
                            setCurrentContentKey(hash)
                            return
                        }
                    }
                }
            }
            // If no hash or content found, show welcome page
            setCurrentPage(languageData?.ui?.breadcrumb?.current || "Welcome")
            setCurrentContentKey(null)
        }

        updateCurrentPage()
        window.addEventListener('hashchange', updateCurrentPage)

        return () => {
            window.removeEventListener('hashchange', updateCurrentPage)
        }
    }, [languageData])

    const renderMainContent = () => {
        if (currentContentKey) {
            return <ContentRenderer contentKey={currentContentKey} languageData={languageData} />
        } else {
            return <Landing />
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 overflow-hidden">
                    <SidebarTrigger className="-ml-1 cursor-pointer" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb className="flex-1 min-w-0">
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    {languageData?.ui?.breadcrumb?.home || <Skeleton className="h-4 w-24" />}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="truncate">
                                    {currentPage}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6 overflow-x-hidden">
                    {renderMainContent()}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
