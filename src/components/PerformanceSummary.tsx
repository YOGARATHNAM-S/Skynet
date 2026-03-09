import { usePerformanceSummary } from "@/hooks/use-people";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Wrench, Users, Activity, Target, Crosshair, BarChart3 } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts";

interface PerformanceSummaryProps {
  personId: string;
}

const COLORS = {
  technical: "hsl(82, 45%, 35%)",
  nonTechnical: "hsl(45, 60%, 48%)",
  overall: "hsl(152, 50%, 38%)",
  grid: "hsl(90, 6%, 85%)",
  dim: "hsl(90, 5%, 45%)",
  radarFill: "hsl(82, 45%, 35%)",
  radarStroke: "hsl(82, 50%, 30%)",
};

const PIE_COLORS = [COLORS.technical, COLORS.nonTechnical, COLORS.overall];

function GaugeCard({ label, value, max, icon: Icon, color, sublabel }: {
  label: string; value: number; max: number; icon: React.ElementType; color: string; sublabel?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="relative flex flex-col items-center gap-2 p-5 rounded-2xl bg-card border border-border/40 overflow-hidden group hover:border-primary/30 transition-colors">
      {/* Subtle progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <div className="h-full rounded-r-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span className="text-3xl font-bold tracking-tight" style={{ color }}>{value.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      {sublabel && <span className="text-[10px] text-muted-foreground/60">{sublabel}</span>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[11px] font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>{entry.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {value.toFixed(1)}
    </text>
  );
};

export function PerformanceSummary({ personId }: PerformanceSummaryProps) {
  const { data: summary, isLoading } = usePerformanceSummary(personId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 rounded-2xl bg-muted/50 animate-pulse" />
          <div className="h-72 rounded-2xl bg-muted/50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!summary || summary.eprCount === 0) {
    return (
      <Card className="glass rounded-2xl border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground text-sm gap-3">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Activity className="h-5 w-5 opacity-40" />
          </div>
          <span>No performance data available yet</span>
        </CardContent>
      </Card>
    );
  }

  const radarData = [
    { skill: "Overall", value: summary.averageOverallRating, fullMark: 5 },
    { skill: "Technical", value: summary.averageTechnicalRating, fullMark: 5 },
    { skill: "CRM", value: summary.averageNonTechnicalRating, fullMark: 5 },
    { skill: "Consistency", value: Math.min(5, summary.eprCount > 1 ? 5 - Math.abs(summary.averageTechnicalRating - summary.averageNonTechnicalRating) : summary.averageOverallRating), fullMark: 5 },
    { skill: "Progress", value: Math.min(5, summary.lastThreePeriods.length > 0 ? summary.lastThreePeriods[0].overallRating : summary.averageOverallRating), fullMark: 5 },
  ];

  const pieData = [
    { name: "Technical", value: summary.averageTechnicalRating },
    { name: "Non-Technical", value: summary.averageNonTechnicalRating },
    { name: "Overall", value: summary.averageOverallRating },
  ];

  const areaData = [...summary.lastThreePeriods].reverse().map((epr) => ({
    period: epr.periodLabel,
    Technical: epr.overallRating,
    "Non-Technical": epr.overallRating,
    Overall: epr.overallRating,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Performance Dashboard</h3>
        </div>
        <Badge className="bg-primary/10 text-primary border-0 rounded-full text-xs font-semibold px-3">
          {summary.eprCount} EPR{summary.eprCount !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Gauge cards */}
      <div className="grid grid-cols-3 gap-3">
        <GaugeCard label="Overall" value={summary.averageOverallRating} max={5} icon={Star} color={COLORS.overall} sublabel="out of 5.0" />
        <GaugeCard label="Technical" value={summary.averageTechnicalRating} max={5} icon={Wrench} color={COLORS.technical} sublabel="out of 5.0" />
        <GaugeCard label="CRM Skills" value={summary.averageNonTechnicalRating} max={5} icon={Users} color={COLORS.nonTechnical} sublabel="out of 5.0" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar */}
        <Card className="rounded-2xl border-border/40 overflow-hidden">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2 font-semibold text-muted-foreground">
              <Crosshair className="h-3.5 w-3.5 text-primary" />
              Competency Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-2">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
                <PolarGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: COLORS.dim, fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: COLORS.dim, fontSize: 8 }} tickCount={6} />
                <Radar
                  name="Rating"
                  dataKey="value"
                  stroke={COLORS.radarStroke}
                  fill={COLORS.radarFill}
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.radarStroke, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut pie */}
        <Card className="rounded-2xl border-border/40 overflow-hidden">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2 font-semibold text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  label={renderCustomPieLabel}
                  labelLine={false}
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={28}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-[11px] font-medium text-muted-foreground ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area trend chart */}
      {areaData.length > 0 && (
        <Card className="rounded-2xl border-border/40 overflow-hidden">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm flex items-center gap-2 font-semibold text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              Period Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gradTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.technical} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.technical} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNonTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.nonTechnical} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.nonTechnical} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.overall} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.overall} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="period" tick={{ fill: COLORS.dim, fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: COLORS.dim, fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-[11px] font-medium text-muted-foreground ml-1">{value}</span>
                  )}
                />
                <Area type="monotone" dataKey="Technical" stroke={COLORS.technical} fill="url(#gradTech)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.technical, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="Non-Technical" stroke={COLORS.nonTechnical} fill="url(#gradNonTech)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.nonTechnical, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="Overall" stroke={COLORS.overall} fill="url(#gradOverall)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.overall, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
