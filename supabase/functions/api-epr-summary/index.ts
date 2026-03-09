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
    const personId = url.searchParams.get("personId");

    if (!personId) {
      return new Response(JSON.stringify({ error: "personId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get person info
    const { data: person } = await supabase
      .from("users")
      .select("role")
      .eq("id", personId)
      .single();

    // Get all EPR records
    const { data: eprs, error } = await supabase
      .from("epr_records")
      .select("*")
      .eq("person_id", personId)
      .order("period_start", { ascending: false });

    if (error) throw error;

    if (!eprs || eprs.length === 0) {
      return new Response(
        JSON.stringify({
          personId,
          roleType: person?.role ?? "student",
          averageOverallRating: 0,
          averageTechnicalRating: 0,
          averageNonTechnicalRating: 0,
          eprCount: 0,
          lastThreePeriods: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const avg = (arr: number[]) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

    const lastThree = eprs.slice(0, 3).map((e: any) => {
      const start = new Date(e.period_start);
      const quarter = Math.ceil((start.getMonth() + 1) / 3);
      return {
        periodLabel: `Q${quarter} ${start.getFullYear()}`,
        overallRating: e.overall_rating,
      };
    });

    const summary = {
      personId,
      roleType: person?.role ?? "student",
      averageOverallRating: avg(eprs.map((e: any) => e.overall_rating)),
      averageTechnicalRating: avg(eprs.map((e: any) => e.technical_skills_rating)),
      averageNonTechnicalRating: avg(eprs.map((e: any) => e.non_technical_skills_rating)),
      eprCount: eprs.length,
      lastThreePeriods: lastThree,
    };

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
