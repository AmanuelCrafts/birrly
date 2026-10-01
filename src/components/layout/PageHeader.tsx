import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, className, action }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between px-5 pt-7 pb-4", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-surface-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
