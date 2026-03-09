import { EprRecord } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FileText, Star, ChevronRight } from "lucide-react";

interface EPRListProps {
  eprs: EprRecord[];
  isLoading?: boolean;
  onSelect: (epr: EprRecord) => void;
}

const statusVariant: Record<string, string> = {
  draft: "bg-warning/10 text-warning",
  submitted: "bg-primary/10 text-primary",
  archived: "bg-muted text-muted-foreground",
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-primary text-primary" : "text-border"
          )}
        />
      ))}
    </div>
  );
}

export function EPRList({ eprs, isLoading, onSelect }: EPRListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (eprs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-sm gap-2">
        <FileText className="h-8 w-8 opacity-30" />
        No EPR records found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {eprs.map((epr) => (
        <button
          key={epr.id}
          onClick={() => onSelect(epr)}
          className="w-full flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 text-left hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">
                {format(new Date(epr.period_start), "MMM yyyy")} — {format(new Date(epr.period_end), "MMM yyyy")}
              </span>
              <Badge variant="secondary" className={cn("text-[10px] rounded-full font-medium border-0", statusVariant[epr.status])}>
                {epr.status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Evaluated by {epr.evaluator_name}
            </div>
          </div>
          <RatingStars rating={epr.overall_rating} />
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        </button>
      ))}
    </div>
  );
}
