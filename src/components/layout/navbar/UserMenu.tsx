"use client";

import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getInitials(name?: string, email?: string, role?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email?.trim()) return email.slice(0, 2).toUpperCase();
  if (role?.trim()) return role.slice(0, 2).toUpperCase();
  return "U";
}

export function UserMenu() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  const displayName =
    user?.name?.trim() ||
    user?.email?.trim() ||
    (user?.role ? user.role : t("account"));
  const initials = getInitials(user?.name, user?.email, user?.role);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* Local session is cleared in queryFn even when dispatch fails */
    }
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-full outline-none",
          "transition-opacity hover:opacity-90",
          "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        )}
        aria-label={t("openMenu")}
      >
        <Avatar
          size="default"
          className="size-9 border border-border bg-muted"
        >
          <AvatarFallback className="bg-muted text-xs font-semibold text-popover-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[8.75rem] truncate text-sm font-medium text-popover-foreground md:inline">
          {displayName}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-popover-foreground">
              {displayName}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/profile"
                className="flex cursor-pointer items-center gap-2"
              />
            }
          >
            <User className="size-4 text-muted-foreground" aria-hidden />
            {t("viewProfile")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoading}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut className="size-4" aria-hidden />
            {tAuth("logout")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
