import { Check, ChevronsUpDown } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { Skeleton } from "@/components/ui/skeleton"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function LanguageSwitcher() {
    const {
        currentLanguage,
        availableLanguages,
        isLoading,
        changeLanguage,
        getCurrentLanguageInfo,
        languageData,
    } = useLanguage()

    const currentLanguageInfo = getCurrentLanguageInfo()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            disabled={isLoading}
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <span className="text-lg">{currentLanguageInfo.flag}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-medium">{languageData?.ui?.language?.label || <Skeleton className="h-4 w-16" />}</span>
                                <span className="">{isLoading ? (languageData?.ui?.loading || <Skeleton className="h-3 w-20" />) : currentLanguageInfo.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width)"
                        align="start"
                    >
                        {availableLanguages.map((language) => (
                            <DropdownMenuItem
                                key={language.code}
                                onSelect={() => changeLanguage(language.code)}
                                disabled={isLoading}
                            >
                                <span className="mr-2">{language.flag}</span>
                                {language.name}{" "}
                                {language.code === currentLanguage && <Check className="ml-auto" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
