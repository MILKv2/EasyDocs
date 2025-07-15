import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { Menu } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function NavDialog() {
  const { languageData } = useLanguage()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {languageData?.ui?.navbar?.title || <Skeleton className="h-5 w-24" />}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {languageData?.ui?.navbar?.description || <Skeleton className="h-4 w-48" />}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <Button variant="outline" asChild className="w-full justify-start">
            <a href="/" className="flex items-center w-full">
              {languageData?.ui?.navbar?.home || <Skeleton className="h-4 w-12" />}
            </a>
          </Button>
          <Button variant="outline" asChild className="w-full justify-start">
            <a 
              href="https://github.com/MILKv2/easydocs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              {languageData?.ui?.navbar?.github || <Skeleton className="h-4 w-14" />}
            </a>
          </Button>
          <Button variant="outline" asChild className="w-full justify-start">
            <a 
              href="https://ui.shadcn.com/docs/components" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              {languageData?.ui?.navbar?.components || <Skeleton className="h-4 w-20" />}
            </a>
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">
            {languageData?.ui?.navbar?.close || <Skeleton className="h-4 w-12" />}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
