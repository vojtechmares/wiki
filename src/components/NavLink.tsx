import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  isActive,
  className,
  children,
}: {
  href: string;
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      render={<a href={href} />}
      nativeButton={false}
      variant="ghost"
      size="sm"
      className={cn(
        "no-underline",
        isActive ? "text-orange-500 bg-zinc-800" : "text-zinc-300",
        className,
      )}
    >
      {children}
    </Button>
  );
}
