import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");

    // GET /api/people
    let query = supabase.from("users").select("*");

    if (role && role !== "all") {
      query = query.eq("role", role);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query.order("name");
    if (error) throw error;

    // Enrich students with enrollment/course info
    const studentIds = users.filter((u: any) => u.role === "student").map((u: any) => u.id);
    const instructorIds = users.filter((u: any) => u.role === "instructor").map((u: any) => u.id);

    let enrollmentMap: Record<string, { course_name: string; status: string }> = {};
    if (studentIds.length > 0) {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("student_id, status, courses(name)")
        .in("student_id", studentIds);
      if (enrollments) {
        for (const e of enrollments as any[]) {
          enrollmentMap[e.student_id] = {
            course_name: e.courses?.name ?? "Unknown",
            status: e.status,
          };
        }
      }
    }

    let eprCountMap: Record<string, number> = {};
    if (instructorIds.length > 0) {
      const { data: eprCounts } = await supabase
        .from("epr_records")
        .select("evaluator_id")
        .in("evaluator_id", instructorIds);
      if (eprCounts) {
        for (const e of eprCounts as any[]) {
          eprCountMap[e.evaluator_id] = (eprCountMap[e.evaluator_id] || 0) + 1;
        }
      }
    }

    const result = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      ...(u.role === "student" && enrollmentMap[u.id]
        ? { course_name: enrollmentMap[u.id].course_name, enrollment_status: enrollmentMap[u.id].status }
        : {}),
      ...(u.role === "instructor" ? { total_eprs_written: eprCountMap[u.id] || 0 } : {}),
    }));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
