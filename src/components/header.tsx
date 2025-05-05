import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Hospital, HeartPulse, ShoppingCart, Video } from "lucide-react";

export function Header() {
  const navItems = [
    { href: "/video-call", label: "Video Call", icon: Video },
    { href: "/heart-tracker", label: "Heart Tracker", icon: HeartPulse, disabled: true }, // Disabled for now
    { href: "/store", label: "Store", icon: ShoppingCart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Hospital className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              MediCall
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                 className={`transition-colors hover:text-foreground/80 ${item.disabled ? 'text-muted-foreground pointer-events-none' : 'text-foreground/60'}`}
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Link href="/" className="flex items-center space-x-2">
             <Hospital className="h-6 w-6 text-primary" />
             <span className="font-bold">MediCall</span>
           </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                   <Link
                     key={item.label}
                     href={item.href}
                     className={`flex items-center px-4 py-2 rounded-md ${
                       item.disabled
                         ? 'text-muted-foreground pointer-events-none cursor-not-allowed'
                         : 'hover:bg-accent hover:text-accent-foreground'
                     }`}
                    aria-disabled={item.disabled}
                    tabIndex={item.disabled ? -1 : undefined}
                   >
                     <item.icon className="mr-2 h-4 w-4" />
                     {item.label}
                   </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Actions (e.g., Login/Profile) - Placeholder */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
           <Button variant="outline">Log In</Button>
           <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
