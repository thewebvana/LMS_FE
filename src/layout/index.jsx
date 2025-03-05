"use client";

import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Header } from "@/components/header/app-header";

export default function Layout({ children }) {


  const pathname = useLocation().pathname
  const isAuthPage = pathname === "/" || pathname === "/signup";


  return (
    <div>
      {isAuthPage ? (
        <div>{children}</div>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>

            <Header />
            <div className="p-4 pt-0">{children}</div>

          </SidebarInset>
        </SidebarProvider>
      )}
    </div>
  );
}
