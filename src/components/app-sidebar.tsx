import * as React from "react"
import { ChevronRight } from "lucide-react"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile, setOpenMobile } = useSidebar();
    const { languageData, isLoading, error } = useLanguage()

    if (isLoading) {
        return (
            <Sidebar {...props}>
                <SidebarHeader className="cursor-pointer">
                    <LanguageSwitcher />
                </SidebarHeader>
                <SidebarContent>
                    <div className="p-4 space-y-6">
                        {[1, 2, 3].map((section) => (
                            <div key={section} className="space-y-3">
                                <Skeleton className="h-4 w-32" />
                                <div className="space-y-2 pl-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <Skeleton key={item} className="h-6 w-full" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <p className="text-xs text-muted-foreground text-center">
                        Created by <a href="https://milkthe.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">milkv2</a> with ❤️
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        EasyDocs is <a href="https://github.com/MILKv2/easydocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenSource</a> under the MIT license
                    </p>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    }

    if (error || !languageData) {
        return (
            <Sidebar {...props}>
                <SidebarHeader>
                    <LanguageSwitcher />
                </SidebarHeader>
                <SidebarContent>
                    <div className="p-4 text-center text-red-500">
                        {languageData?.ui?.error || <Skeleton className="h-4 w-48 mx-auto" />}
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <p className="text-xs text-muted-foreground text-center">
                        Created by <a href="https://milkthe.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">milkv2</a> with ❤️
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        EasyDocs is <a href="https://github.com/MILKv2/easydocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenSource</a> under the MIT license
                    </p>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        )
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <LanguageSwitcher />
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {/* We create a collapsible SidebarGroup for each section with pages. */}
                {languageData.content && Object.entries(languageData.content).map(([sectionKey, sectionObj]) => (
                    sectionObj.pages && (
                        <Collapsible
                            key={sectionKey}
                            title={sectionObj.title}
                            defaultOpen
                            className="group/collapsible"
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel
                                    asChild
                                    className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                                >
                                    <CollapsibleTrigger>
                                        {sectionObj.title}{" "}
                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {Object.keys(sectionObj.pages)
                                                .filter((key) => /^\d+$/.test(key))
                                                .sort((a, b) => Number(a) - Number(b))
                                                .map((pageNum) => {
                                                    const pageObj = sectionObj.pages[pageNum];
                                                    return (
                                                        <SidebarMenuItem key={pageNum}>
                                                            <SidebarMenuButton asChild>
                                                                <a
                                                                    href={`#${pageNum}`}
                                                                    onClick={() => {
                                                                        if (isMobile) setOpenMobile(false);
                                                                    }}
                                                                >
                                                                    {(pageObj as { title?: string }).title || pageNum}
                                                                </a>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    );
                                                })}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    )
                ))}
            </SidebarContent>
            <SidebarFooter>
                <p className="text-xs text-muted-foreground text-center">
                    Created by <a href="https://milkthe.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">milkv2</a> with ❤️
                </p>
                <p className="text-xs text-muted-foreground text-center">
                    EasyDocs is <a href="https://github.com/MILKv2/easydocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenSource</a> under the MIT license
                </p>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
