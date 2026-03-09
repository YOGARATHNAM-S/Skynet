import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { EprRecord, EprFormData, createEpr, updateEpr, generateRemarks } from "@/lib/api";
import { useInstructors } from "@/hooks/use-people";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Save, Star } from "lucide-react";

interface EPRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
  personName: string;
  epr?: EprRecord | null;
}

function RatingSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <div className="flex items-center gap-1 text-sm font-mono font-semibold">
          {value}
          <Star className="h-3 w-3 fill-primary text-primary" />
        </div>
      </div>
      <Slider
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
}

export function EPRModal({ open, onOpenChange, personId, personName, epr }: EPRModalProps) {
  const queryClient = useQueryClient();
  const { data: instructors = [] } = useInstructors();
  const isEditing = !!epr;

  const [form, setForm] = useState<{
    evaluator_id: string;
    period_start: string;
    period_end: string;
    overall_rating: number;
    technical_skills_rating: number;
    non_technical_skills_rating: number;
    remarks: string;
    status: "draft" | "submitted";
  }>({
    evaluator_id: "",
    period_start: "",
    period_end: "",
    overall_rating: 3,
    technical_skills_rating: 3,
    non_technical_skills_rating: 3,
    remarks: "",
    status: "draft",
  });

  useEffect(() => {
    if (epr) {
      setForm({
        evaluator_id: epr.evaluator_id,
        period_start: epr.period_start,
        period_end: epr.period_end,
        overall_rating: epr.overall_rating,
        technical_skills_rating: epr.technical_skills_rating,
        non_technical_skills_rating: epr.non_technical_skills_rating,
        remarks: epr.remarks || "",
        status: epr.status === "archived" ? "submitted" : epr.status,
      });
    } else {
      setForm({
        evaluator_id: instructors[0]?.id || "",
        period_start: "",
        period_end: "",
        overall_rating: 3,
        technical_skills_rating: 3,
        non_technical_skills_rating: 3,
        remarks: "",
        status: "draft",
      });
    }
  }, [epr, open, instructors]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: EprFormData = {
        person_id: personId,
        role_type: "student",
        ...form,
      };
      if (isEditing && epr) {
        return updateEpr(epr.id, form);
      }
      return createEpr(payload);
    },
    onSuccess: () => {
      toast.success(isEditing ? "EPR updated successfully" : "EPR created successfully");
      queryClient.invalidateQueries({ queryKey: ["eprs", personId] });
      queryClient.invalidateQueries({ queryKey: ["performance-summary", personId] });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleGenerateRemarks = async () => {
    const remarks = await generateRemarks({
      overall: form.overall_rating,
      technical: form.technical_skills_rating,
      nonTechnical: form.non_technical_skills_rating,
    });
    setForm((f) => ({ ...f, remarks }));
    toast.success("AI remarks generated");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "New"} EPR — {personName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Period Start</Label>
              <Input
                type="date"
                value={form.period_start}
                onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Period End</Label>
              <Input
                type="date"
                value={form.period_end}
                onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Evaluator</Label>
            <Select value={form.evaluator_id} onValueChange={(v) => setForm((f) => ({ ...f, evaluator_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select evaluator" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((i) => (
                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-lg border border-border/50 p-4 bg-muted/30">
            <RatingSlider
              label="Overall Rating"
              value={form.overall_rating}
              onChange={(v) => setForm((f) => ({ ...f, overall_rating: v }))}
            />
            <RatingSlider
              label="Technical Skills"
              value={form.technical_skills_rating}
              onChange={(v) => setForm((f) => ({ ...f, technical_skills_rating: v }))}
            />
            <RatingSlider
              label="Non-Technical Skills"
              value={form.non_technical_skills_rating}
              onChange={(v) => setForm((f) => ({ ...f, non_technical_skills_rating: v }))}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Remarks</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateRemarks}
                className="text-xs gap-1 text-primary hover:text-primary"
              >
                <Sparkles className="h-3 w-3" />
                AI Suggest
              </Button>
            </div>
            <Textarea
              rows={4}
              value={form.remarks}
              onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
              placeholder="Enter performance remarks..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v: "draft" | "submitted") => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full gap-2"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.period_start || !form.period_end || !form.evaluator_id}
          >
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Saving..." : isEditing ? "Update EPR" : "Create EPR"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
