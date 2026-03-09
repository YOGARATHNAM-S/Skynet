import { supabase } from "@/integrations/supabase/client";

// Types
export interface Person {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  created_at: string;
  course_name?: string;
  enrollment_status?: string;
  total_eprs_written?: number;
}

export interface EprRecord {
  id: string;
  person_id: string;
  evaluator_id: string;
  role_type: "student" | "instructor";
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills_rating: number;
  non_technical_skills_rating: number;
  remarks: string | null;
  status: "draft" | "submitted" | "archived";
  created_at: string;
  updated_at: string;
  evaluator_name?: string;
}

export interface PerformanceSummary {
  personId: string;
  roleType: string;
  averageOverallRating: number;
  averageTechnicalRating: number;
  averageNonTechnicalRating: number;
  eprCount: number;
  lastThreePeriods: { periodLabel: string; overallRating: number }[];
}

export interface EprFormData {
  person_id: string;
  evaluator_id: string;
  role_type: "student" | "instructor";
  period_start: string;
  period_end: string;
  overall_rating: number;
  technical_skills_rating: number;
  non_technical_skills_rating: number;
  remarks: string;
  status: "draft" | "submitted";
}

// Helper to invoke edge functions
async function invokeFunction(name: string, options?: { method?: string; body?: any; queryParams?: Record<string, string> }) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  let url = `https://${projectId}.supabase.co/functions/v1/${name}`;
  
  if (options?.queryParams) {
    const params = new URLSearchParams(options.queryParams);
    url += `?${params.toString()}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "apikey": anonKey,
    "Authorization": `Bearer ${anonKey}`,
  };

  const res = await fetch(url, {
    method: options?.method || "GET",
    headers,
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.errors?.join(", ") || "Request failed");
  }

  return res.json();
}

// ── Backend API calls ──

// GET /api/people
export async function fetchPeople(role?: string, search?: string): Promise<Person[]> {
  const queryParams: Record<string, string> = {};
  if (role && role !== "all") queryParams.role = role;
  if (search) queryParams.search = search;

  return invokeFunction("api-people", { queryParams });
}

// GET /api/epr?personId=...
export async function fetchPersonEprs(personId: string): Promise<EprRecord[]> {
  return invokeFunction("api-epr", { queryParams: { personId } });
}

// GET /api/epr?id=...
export async function fetchEpr(id: string): Promise<EprRecord> {
  return invokeFunction("api-epr", { queryParams: { id } });
}

// GET /api/epr/summary/:personId
export async function fetchPerformanceSummary(personId: string): Promise<PerformanceSummary> {
  return invokeFunction("api-epr-summary", { queryParams: { personId } });
}

// POST /api/epr
export async function createEpr(data: EprFormData): Promise<EprRecord> {
  return invokeFunction("api-epr", {
    method: "POST",
    body: {
      personId: data.person_id,
      evaluatorId: data.evaluator_id,
      roleType: data.role_type,
      periodStart: data.period_start,
      periodEnd: data.period_end,
      overallRating: data.overall_rating,
      technicalSkillsRating: data.technical_skills_rating,
      nonTechnicalSkillsRating: data.non_technical_skills_rating,
      remarks: data.remarks,
      status: data.status,
    },
  });
}

// PATCH /api/epr/:id
export async function updateEpr(id: string, data: Partial<EprFormData>): Promise<EprRecord> {
  const body: Record<string, any> = {};
  if (data.overall_rating !== undefined) body.overallRating = data.overall_rating;
  if (data.technical_skills_rating !== undefined) body.technicalSkillsRating = data.technical_skills_rating;
  if (data.non_technical_skills_rating !== undefined) body.nonTechnicalSkillsRating = data.non_technical_skills_rating;
  if (data.remarks !== undefined) body.remarks = data.remarks;
  if (data.status !== undefined) body.status = data.status;

  return invokeFunction("api-epr", {
    method: "PATCH",
    queryParams: { id },
    body,
  });
}

// POST /api/epr/assist
export async function generateRemarks(ratings: {
  overall: number;
  technical: number;
  nonTechnical: number;
}): Promise<string> {
  const result = await invokeFunction("api-epr-assist", {
    method: "POST",
    body: {
      overallRating: ratings.overall,
      technicalSkillsRating: ratings.technical,
      nonTechnicalSkillsRating: ratings.nonTechnical,
    },
  });
  return result.suggestedRemarks;
}

// Fetch instructors (still via Supabase client for simple query)
export async function fetchInstructors(): Promise<Pick<Person, "id" | "name">[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "instructor")
    .order("name");

  if (error) throw error;
  return data || [];
}
