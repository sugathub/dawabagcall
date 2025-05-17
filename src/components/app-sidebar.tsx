
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, MessageSquare, Settings, User, HelpCircle, Headset, PanelLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/chat", label: "Chat", icon: MessageSquare, badge: 2 }, // Example badge
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

const supportItems = [
  { href: "/support", label: "Support", icon: Headset },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();

  const isActive = (href: string) => {
    // Handle exact match for home page, partial match otherwise
    return href === "/" ? pathname === href : pathname.startsWith(href);
  };

  return (
    <>
       {/* Header with Logo and Toggle */}
      <SidebarHeader className={cn("flex items-center justify-between", {"justify-center": state === 'collapsed'})}>
         {/* Logo - Text based on image */}
         <Link href="/" className={cn("font-bold text-xl text-primary", {"hidden": state === 'collapsed'})}>
           dawabagCall
         </Link>

         {/* Toggle Button (Desktop only) */}
         <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8 shrink-0"
            onClick={toggleSidebar}
          >
           <PanelLeft className="h-5 w-5" />
           <span className="sr-only">Toggle Sidebar</span>
         </Button>
       </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="p-2 flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <a>
                    <item.icon />
                    <span className={cn({"hidden": state === 'collapsed'})}>{item.label}</span>
                     {item.badge && state === 'expanded' && (
                       <Badge variant="secondary" className="ml-auto h-5">
                         {item.badge}
                       </Badge>
                     )}
                     {/* Show badge dot when collapsed */}
                      {item.badge && state === 'collapsed' && (
                         <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar-background" />
                      )}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

       {/* Footer Support Links */}
       <SidebarFooter className="p-2 border-t border-sidebar-border">
         <SidebarMenu>
           {supportItems.map((item) => (
             <SidebarMenuItem key={item.label}>
               <Link href={item.href} legacyBehavior passHref>
                 <SidebarMenuButton
                   asChild
                   isActive={isActive(item.href)}
                   tooltip={item.label}
                   className="justify-start"
                 >
                   <a>
                     <item.icon />
                     <span className={cn({"hidden": state === 'collapsed'})}>{item.label}</span>
                   </a>
                 </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
           ))}
         </SidebarMenu>
       </SidebarFooter>
     </>
  );
}
