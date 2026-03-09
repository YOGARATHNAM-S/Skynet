import { useQuery } from "@tanstack/react-query";
import { fetchPeople, fetchPersonEprs, fetchPerformanceSummary, fetchInstructors } from "@/lib/api";

export function usePeople(role?: string, search?: string) {
  return useQuery({
    queryKey: ["people", role, search],
    queryFn: () => fetchPeople(role, search),
  });
}

export function usePersonEprs(personId: string | undefined) {
  return useQuery({
    queryKey: ["eprs", personId],
    queryFn: () => fetchPersonEprs(personId!),
    enabled: !!personId,
  });
}

export function usePerformanceSummary(personId: string | undefined) {
  return useQuery({
    queryKey: ["performance-summary", personId],
    queryFn: () => fetchPerformanceSummary(personId!),
    enabled: !!personId,
  });
}

export function useInstructors() {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: fetchInstructors,
  });
}
