"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useLanguage } from "@/hooks/useLanguage"
import { NavDialog } from "./nav-dialog"
import { Skeleton } from "@/components/ui/skeleton"


export function Navbar() {
    const { languageData } = useLanguage()

    return (
        <div className="flex items-center">
            <div className="md:hidden">
                <NavDialog />
            </div>
            
            <NavigationMenu viewport={false} className="hidden md:flex">
                <NavigationMenuList className="flex-row space-x-1">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <a 
                                href="/" 
                                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {languageData?.ui?.navbar?.home || <Skeleton className="h-4 w-12" />}
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <a 
                                href="https://github.com/MILKv2/easydocs" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {languageData?.ui?.navbar?.github || <Skeleton className="h-4 w-14" />}
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <a 
                                href="https://ui.shadcn.com/docs/components" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {languageData?.ui?.navbar?.components || <Skeleton className="h-4 w-20" />}
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
