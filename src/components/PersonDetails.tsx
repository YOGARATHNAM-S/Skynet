import { Person } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Mail, BookOpen } from "lucide-react";

interface PersonDetailsProps {
  person: Person;
}

export function PersonDetails({ person }: PersonDetailsProps) {
  return (
    <div className="flex items-start gap-4 p-6 glass rounded-2xl warm-shadow">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {person.role === "student" ? (
          <GraduationCap className="h-6 w-6" />
        ) : (
          <Shield className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold tracking-tight">{person.name}</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          {person.email}
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="capitalize font-semibold rounded-full">
            {person.role}
          </Badge>
          {person.role === "student" && person.course_name && (
            <Badge variant="secondary" className="gap-1 rounded-full">
              <BookOpen className="h-3 w-3" />
              {person.course_name}
            </Badge>
          )}
          {person.role === "instructor" && (
            <Badge variant="secondary" className="rounded-full">
              {person.total_eprs_written} EPRs written
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
