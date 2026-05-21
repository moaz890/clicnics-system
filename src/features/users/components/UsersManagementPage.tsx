"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetUserByIdQuery, useGetUsersQuery } from "../store/usersApi";
import { getUserFullName } from "../lib/normalize";
import {
  ROLE_FILTER_LABEL_KEYS,
  USER_ROLE_FILTER_OPTIONS,
} from "../lib/constants";
import type { UserListItem, UserRole } from "../types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "./UsersTable";
import { UserFormDialog } from "./UserFormDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";

type RoleFilter = UserRole | "all";

function matchesSearch(user: UserListItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    user.firstName,
    user.lastName,
    getUserFullName(user),
    user.email,
    user.phoneNumber,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function UsersManagementPage() {
  const t = useTranslations("users");
  const isAdmin = useIsAdmin();
  const reduceMotion = useReducedMotion();
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);

  const { data: editUser } = useGetUserByIdQuery(editUserId ?? "", {
    skip: !editUserId || !formOpen || formMode !== "edit",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = roleFilter === "all" || user.role === roleFilter;
      return roleMatch && matchesSearch(user, search);
    });
  }, [users, roleFilter, search]);

  const activeCount = useMemo(
    () => users.filter((user) => !user.isBlocked).length,
    [users],
  );

  const openCreate = () => {
    setFormMode("create");
    setEditUserId(null);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    setFormMode("edit");
    setEditUserId(id);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-6 sm:p-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1 text-start">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
        </div>
        {isAdmin ? (
          <Button
            onClick={openCreate}
            className="cursor-pointer rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-[var(--design-primary-active)]"
          >
            <Plus className="size-4" aria-hidden />
            {t("createAccount")}
          </Button>
        ) : null}
      </motion.header>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.05 }}
      >
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-base font-semibold text-popover-foreground">
                {t("totalActiveUsers")}
              </CardTitle>
            </div>
            <p className="text-2xl font-bold tabular-nums text-primary">
              {activeCount}
              <span className="ms-1 text-sm font-normal text-muted-foreground">
                / {users.length}
              </span>
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">{t("totalActiveHint")}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.08 }}
        className="flex flex-col gap-4"
      >
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 cursor-text rounded-xl ps-10"
            aria-label={t("searchPlaceholder")}
          />
        </div>

        <Tabs
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as RoleFilter)}
        >
          <TabsList
            variant="line"
            aria-label={t("filterByRole")}
            className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0"
          >
            {USER_ROLE_FILTER_OPTIONS.map((role) => (
              <TabsTrigger
                key={role}
                value={role}
                className="cursor-pointer px-4 py-2"
              >
                {t(ROLE_FILTER_LABEL_KEYS[role])}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.1 }}
      >
        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          isError={isError}
          canManage={isAdmin}
          onEdit={openEdit}
          onDelete={(user) => setDeleteTarget(user)}
        />
      </motion.div>

      {isAdmin ? (
        <>
          <UserFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            user={formMode === "edit" ? editUser : undefined}
          />

          <DeleteUserDialog
            user={deleteTarget}
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
