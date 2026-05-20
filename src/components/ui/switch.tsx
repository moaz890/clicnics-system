"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-[size=default]:h-[1.15rem] data-[size=default]:w-8",
        "data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        "data-checked:bg-[var(--design-success)]",
        "data-unchecked:bg-[var(--design-hairline)]",
        "dark:data-unchecked:bg-[var(--design-surface-dark-soft)]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-[var(--design-on-primary)] shadow-sm",
          "transition-[inset-inline-start,inset-inline-end] duration-200 ease-out",
          "start-0.5 end-auto",
          "data-checked:start-auto data-checked:end-0.5",
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
