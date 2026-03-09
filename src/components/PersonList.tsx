import { Person } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Shield } from "lucide-react";

interface PersonListProps {
  people: Person[];
  selectedId?: string;
  onSelect: (person: Person) => void;
  isLoading?: boolean;
}

const roleIcon = {
  student: GraduationCap,
  instructor: Shield,
  admin: User,
};

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
  dropped: "bg-destructive/10 text-destructive",
};

export function PersonList({ people, selectedId, onSelect, isLoading }: PersonListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
        No people found
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {people.map((person) => {
        const Icon = roleIcon[person.role] || User;
        return (
          <button
            key={person.id}
            onClick={() => onSelect(person)}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200",
              "hover:bg-primary/5",
              selectedId === person.id
                ? "bg-primary/8 shadow-sm ring-1 ring-primary/20"
                : ""
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
              selectedId === person.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate">{person.name}</div>
              <div className="text-xs text-muted-foreground truncate">{person.email}</div>
            </div>
            {person.role === "student" && person.enrollment_status && (
              <Badge variant="secondary" className={cn("text-[10px] shrink-0 rounded-full font-medium", statusColors[person.enrollment_status])}>
                {person.enrollment_status}
              </Badge>
            )}
            {person.role === "instructor" && (
              <span className="text-xs text-muted-foreground shrink-0">
                {person.total_eprs_written} EPRs
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
