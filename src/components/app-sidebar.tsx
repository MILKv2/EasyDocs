import * as React from "react"

import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { Skeleton } from "@/components/ui/skeleton"
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
            <SidebarContent>
                {languageData.sidebar && languageData.sidebar.sections && Object.entries(languageData.sidebar.sections).map(([sectionKey, section]) => {
                    if (section && typeof section === 'object' && 'title' in section && 'items' in section) {
                        const sectionWithData = section as { title: string; items: { [key: string]: string } }
                        return (
                            <SidebarGroup key={sectionKey}>
                                <SidebarGroupLabel>{sectionWithData.title}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {sectionWithData.items && Object.entries(sectionWithData.items).map(([itemKey, itemTitle]) => (
                                        <SidebarMenuItem key={itemKey}>
                                            <SidebarMenuButton asChild>
                                                <a
                                                    href={`#${itemKey}`}
                                                    onClick={() => {
                                                        if (isMobile) setOpenMobile(false);
                                                    }}
                                                >
                                                    {itemTitle}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )
                    }
                    return null
                })}
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
