import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  label?: string;
  className?: string;
}

export function ComingSoon({ label = "Coming Soon", className }: ComingSoonProps) {
  return (
    <Badge variant="muted" className={className}>
      <Clock className="h-3 w-3" />
      {label}
    </Badge>
  );
}
