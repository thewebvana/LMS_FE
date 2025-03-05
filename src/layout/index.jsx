"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header/app-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function Layout({ children }) {
	return (
		<div>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<Header />
						<div className="p-4 pt-0">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</div>
	);
}
