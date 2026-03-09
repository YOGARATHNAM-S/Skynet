import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateRating(value: number, name: string): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return `${name} must be an integer between 1 and 5`;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);

    // GET — list EPRs for a person or get single EPR by id
    if (req.method === "GET") {
      const personId = url.searchParams.get("personId");
      const id = url.searchParams.get("id");

      if (id) {
        // GET /api/epr?id=:id — single EPR detail
        const { data, error } = await supabase
          .from("epr_records")
          .select("*, evaluator:users!epr_records_evaluator_id_fkey(name)")
          .eq("id", id)
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({
            ...data,
            evaluator_name: (data.evaluator as any)?.name ?? "Unknown",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!personId) {
        return new Response(
          JSON.stringify({ error: "personId query parameter is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // GET /api/epr?personId=:personId — list EPRs
      const { data, error } = await supabase
        .from("epr_records")
        .select("*, evaluator:users!epr_records_evaluator_id_fkey(name)")
        .eq("person_id", personId)
        .order("period_start", { ascending: false });

      if (error) throw error;

      const result = (data || []).map((r: any) => ({
        ...r,
        evaluator_name: r.evaluator?.name ?? "Unknown",
      }));

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — create new EPR
    if (req.method === "POST") {
      const body = await req.json();
      const {
        personId, evaluatorId, roleType,
        periodStart, periodEnd,
        overallRating, technicalSkillsRating, nonTechnicalSkillsRating,
        remarks, status,
      } = body;

      // Validation
      const errors: string[] = [];
      for (const [val, name] of [
        [overallRating, "overallRating"],
        [technicalSkillsRating, "technicalSkillsRating"],
        [nonTechnicalSkillsRating, "nonTechnicalSkillsRating"],
      ] as [number, string][]) {
        const err = validateRating(val, name);
        if (err) errors.push(err);
      }

      if (!periodStart || !periodEnd) {
        errors.push("periodStart and periodEnd are required");
      } else if (new Date(periodEnd) < new Date(periodStart)) {
        errors.push("periodEnd must be >= periodStart");
      }

      if (!personId) errors.push("personId is required");
      if (!evaluatorId) errors.push("evaluatorId is required");

      // Verify personId exists
      if (personId) {
        const { data: person } = await supabase.from("users").select("id").eq("id", personId).single();
        if (!person) errors.push("personId does not exist");
      }
      // Verify evaluatorId exists
      if (evaluatorId) {
        const { data: evaluator } = await supabase.from("users").select("id").eq("id", evaluatorId).single();
        if (!evaluator) errors.push("evaluatorId does not exist");
      }

      if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("epr_records")
        .insert({
          person_id: personId,
          evaluator_id: evaluatorId,
          role_type: roleType || "student",
          period_start: periodStart,
          period_end: periodEnd,
          overall_rating: overallRating,
          technical_skills_rating: technicalSkillsRating,
          non_technical_skills_rating: nonTechnicalSkillsRating,
          remarks: remarks || null,
          status: status || "draft",
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH — update EPR
    if (req.method === "PATCH") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "id query parameter is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const updateData: Record<string, any> = {};
      const errors: string[] = [];

      if (body.overallRating !== undefined) {
        const err = validateRating(body.overallRating, "overallRating");
        if (err) errors.push(err);
        updateData.overall_rating = body.overallRating;
      }
      if (body.technicalSkillsRating !== undefined) {
        const err = validateRating(body.technicalSkillsRating, "technicalSkillsRating");
        if (err) errors.push(err);
        updateData.technical_skills_rating = body.technicalSkillsRating;
      }
      if (body.nonTechnicalSkillsRating !== undefined) {
        const err = validateRating(body.nonTechnicalSkillsRating, "nonTechnicalSkillsRating");
        if (err) errors.push(err);
        updateData.non_technical_skills_rating = body.nonTechnicalSkillsRating;
      }
      if (body.remarks !== undefined) updateData.remarks = body.remarks;
      if (body.status !== undefined) updateData.status = body.status;

      if (errors.length > 0) {
        return new Response(JSON.stringify({ errors }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("epr_records")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
