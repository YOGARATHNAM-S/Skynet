const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { overallRating, technicalSkillsRating, nonTechnicalSkillsRating } = await req.json();

    const parts: string[] = [];

    if (overallRating >= 4) {
      parts.push("Demonstrates consistently strong performance across evaluated areas.");
    } else if (overallRating >= 3) {
      parts.push("Performance meets expected standards with room for continued growth.");
    } else {
      parts.push("Performance requires attention and focused improvement in key areas.");
    }

    if (technicalSkillsRating >= 4) {
      parts.push("Technical proficiency is commendable, showing mastery of required procedures and systems.");
    } else if (technicalSkillsRating >= 3) {
      parts.push("Technical skills are developing adequately. Continued practice is recommended.");
    } else {
      parts.push("Technical skills need significant improvement. Additional simulator sessions and ground school review are strongly recommended.");
    }

    if (nonTechnicalSkillsRating >= 4) {
      parts.push("Exhibits excellent crew resource management, communication, and situational awareness.");
    } else if (nonTechnicalSkillsRating >= 3) {
      parts.push("Non-technical skills are satisfactory. Encourage participation in CRM exercises.");
    } else {
      parts.push("Non-technical skills require development. Focus on communication, teamwork, and decision-making processes.");
    }

    return new Response(
      JSON.stringify({ suggestedRemarks: parts.join(" ") }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
