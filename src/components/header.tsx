'use client'; // Add 'use client' because we need useSidebar hook

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Settings, PanelLeft } from "lucide-react"; // Import PanelLeft for the trigger icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar hook
import { cn } from "@/lib/utils";

export function Header() {
  const { toggleSidebar } = useSidebar(); // Get the toggle function

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:border-0 md:bg-transparent md:backdrop-filter-none">
      <div className="container flex h-14 items-center justify-between">
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
             <PanelLeft className="h-5 w-5" />
             <span className="sr-only">Toggle Sidebar</span>
           </Button>
        </div>

        {/* Logo/Brand (visible on larger screens where sidebar might be collapsed) */}
        <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
           {/* Placeholder for .hello doc. logo */}
           <span className="font-bold text-lg text-primary">.hello doc.</span>
        </Link>


        {/* Spacer to push actions to the right */}
        <div className="flex-1"></div>


        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                   {/* Placeholder avatar */}
                   <AvatarImage src="https://picsum.photos/seed/avatar1/40/40" alt="User Avatar" data-ai-hint="professional woman" />
                   <AvatarFallback>U</AvatarFallback>
                 </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Add border only below header on mobile */}
       <div className="border-b md:hidden"></div>
    </header>
  );
}
