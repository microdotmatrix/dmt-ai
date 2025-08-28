"use client";

import { ThemeToggle } from "@/components/theme/toggle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMounted } from "@/hooks/use-mounted";
import { navigationLinks } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

export const Header = () => {
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const mounted = useMounted();
  return (
    <header className="sticky top-0 mt-4 z-50 bg-background border-b px-4 md:px-6 w-full">
      <div className="flex h-16 items-center justify-between gap-4 w-full">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-fit p-1 md:hidden">
              <SignedIn>
                <div className="my-2">
                  <OrganizationSwitcher />
                </div>
                <Separator className="my-2" />
              </SignedIn>
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-1 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive =
                      pathname === link.href ||
                      (pathname.startsWith(`${link.href}/`) &&
                        link.href !== "/");
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className={cn(
                            "flex-row items-center gap-2 py-1.5 font-medium text-accent-foreground/80 hover:text-primary",
                            isActive && "text-primary"
                          )}
                          active={isActive}
                        >
                          <Icon
                            size={16}
                            className={cn(
                              "text-muted-foreground/80",
                              isActive &&
                                "drop-shadow-md drop-shadow-primary/50"
                            )}
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          <NavigationMenu className="max-md:hidden space-x-4 lg:space-x-8">
            <SignedIn>
              <OrganizationSwitcher />
            </SignedIn>
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(`${link.href}/`) && link.href !== "/");
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={isActive}
                      href={link.href}
                      className={cn(
                        "flex-row items-center gap-2 py-1.5 font-medium text-accent-foreground/80 hover:text-primary",
                        isActive && "text-primary"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(
                          "text-muted-foreground/80",
                          isActive && "drop-shadow-md drop-shadow-primary/50"
                        )}
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Middle side: Logo */}
        <div className="flex items-center">
          <a href="#" className="text-primary hover:text-primary/90">
            <Icon icon="simple-icons:nextdotjs" className="size-8" />
          </a>
        </div>

        {/* Right side: Actions */}
        {mounted && (
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* User menu */}
            {isLoaded && (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button variant="ghost" size="icon">
                      <Icon icon="carbon:user-avatar" className="size-8" />
                      <span className="sr-only">Sign in</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            )}
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
};
