"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header/app-header";

export default function Layout({ children }) {
	return (
		<div>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<Header />
					<div className="p-4 pt-0">
						<Outlet />
						
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
