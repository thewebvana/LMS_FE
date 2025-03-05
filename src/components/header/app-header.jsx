
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";


import { ModeToggle } from "@/components/theme/theme-toggle";
import { useLocation } from "react-router-dom";
import { SidebarTrigger, } from "@/components/ui/sidebar";

export function Header() {

    const pathname = useLocation().pathname

    const breadcrumbs = pathname
        .split("/")
        .filter((part) => part)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center w-full gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {breadcrumbs[0]}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumbs[1] && <BreadcrumbSeparator className="hidden md:block" />}
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {breadcrumbs[1]}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <ModeToggle />
                    </div>
                </div>
            </header>

        </>
    )
}


