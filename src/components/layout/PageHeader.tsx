import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, className, action }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between px-4 pt-6 pb-4", className)}>
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm font-semibold text-white/50">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
