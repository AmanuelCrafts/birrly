import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface UserAvatarProps {
  firstName: string;
  lastName?: string;
  id: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export function UserAvatar({
  firstName,
  lastName,
  id,
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border-2 border-white/20 font-black text-white shrink-0",
        getAvatarColor(id),
        sizeClasses[size],
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
