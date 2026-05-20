"use client";

import { Construction } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileSettingsPlaceholderProps {
  title: string;
  description: string;
}

export function ProfileSettingsPlaceholder({
  title,
  description,
}: ProfileSettingsPlaceholderProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center text-center sm:items-start sm:text-start">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Construction className="size-6" aria-hidden />
        </div>
        <CardTitle className="text-base text-popover-foreground">
          {title}
        </CardTitle>
        <CardDescription className="max-w-md text-pretty">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
