import { cn } from "@/lib/utils";

interface LtrTextProps {
  children: React.ReactNode;
  className?: string;
}

/** Renders digits/Latin in LTR without breaking RTL column alignment. */
export function LtrText({ children, className }: LtrTextProps) {
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-block max-w-full text-start [unicode-bidi:isolate]",
        className,
      )}
    >
      {children}
    </span>
  );
}
