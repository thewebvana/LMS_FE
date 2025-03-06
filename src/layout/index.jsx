"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header/app-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {

	const pathname = useLocation().pathname
	const isAuthPage = pathname === "/" || pathname === "/signup";

	return (
		<div>

			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
			</ThemeProvider>
		</div>
	);
}
