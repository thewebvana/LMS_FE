"use client";

import { ThemeProvider } from "@/lib/theme-provider";
import { usePathname } from "next/navigation"; // Import usePathname
import "./globals.css";

import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Header } from "@/components/header/app-header";

export default function RootLayout({ children }) {

  
  const pathname = usePathname()
  const isAuthPage = pathname === "/" || pathname === "/signup";


  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isAuthPage ? (
            <div>{children}</div>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>

                <Header/>

                <div className="p-4 pt-0">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
