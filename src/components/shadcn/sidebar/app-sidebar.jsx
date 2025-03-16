"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartPie,
  Command,
  FileChartColumn,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "@/components/shadcn/sidebar/nav-main"
import { NavUser } from "@/components/shadcn/sidebar/nav-user"
import { TeamSwitcher } from "@/components/shadcn/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/ui/sidebar"
import useAuthStore from "@/store/useAuthStore"

// This is sample data.
const data = {

  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],


  navMain: [

    
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      title: "Attendance",
      url: "#",
      icon: ChartPie,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Users",
          url: "/settings/users",
        },
        {
          title: "Classroom",
          url: "/settings/classrooms",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const { user } = useAuthStore();
  
  let userdata = {
    name: user.full_name,
    email: user.email,
    avatar: User,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userdata} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
