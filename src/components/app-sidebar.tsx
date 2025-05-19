
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, MessageSquare, Settings, User, HelpCircle, Headset, PanelLeft, ShoppingCart, ShoppingBag, ScanLine } from "lucide-react"; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context"; 

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/chat", label: "Chat", icon: MessageSquare, badgeCount: 2 }, 
  { href: "/store", label: "Store", icon: ShoppingBag }, 
  { href: "/prescription-scanner", label: "Scan Rx", icon: ScanLine }, 
];

const userNavItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const supportItems = [
  { href: "/support", label: "Support", icon: Headset },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const { totalItems: cartTotalItems } = useCart();

  const isActive = (href: string) => {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  };

  const navItems = [
    ...mainNavItems,
    { href: "/cart", label: "Cart", icon: ShoppingCart, badgeCount: cartTotalItems },
    ...userNavItems
  ];

  return (
    <>
      <SidebarHeader className={cn("flex items-center justify-between", {"justify-center": state === 'collapsed'})}>
         <Link href="/" className={cn("font-bold text-xl text-primary", {"hidden": state === 'collapsed'})}>
           Dawabag Pharmacy
         </Link>
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
                     {item.badgeCount && item.badgeCount > 0 && state === 'expanded' && (
                       <Badge variant="secondary" className="ml-auto h-5">
                         {item.badgeCount > 9 ? '9+' : item.badgeCount}
                       </Badge>
                     )}
                      {item.badgeCount && item.badgeCount > 0 && state === 'collapsed' && (
                         <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar-background" />
                      )}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

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
    
