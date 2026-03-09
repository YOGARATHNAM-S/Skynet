import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, Shield, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import skynetLogo from "@/assets/skynet-logo.png";
import armyJet from "@/assets/army-jet.png";
import helicopter from "@/assets/helicopter.png";

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>;
}

export default function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await onSignIn(loginEmail, loginPassword);
    if (error) toast.error(error.message);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await onSignUp(signupEmail, signupPassword, signupName, signupRole);
    if (error) toast.error(error.message);
    else toast.success("Account created! You are now signed in.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* ── Animated aviation background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radar rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
          <div className="absolute inset-0 rounded-full border border-primary/[0.06] animate-radar-ping" />
          <div className="absolute inset-12 rounded-full border border-primary/[0.05] animate-radar-ping" style={{ animationDelay: "1.2s" }} />
          <div className="absolute inset-24 rounded-full border border-primary/[0.04] animate-radar-ping" style={{ animationDelay: "2.4s" }} />
          <div className="absolute inset-36 rounded-full border border-primary/[0.03] animate-radar-ping" style={{ animationDelay: "3.6s" }} />
        </div>

        {/* Radar sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]">
          <div className="absolute inset-0 animate-sweep origin-center">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-primary/15 to-transparent origin-left" />
          </div>
        </div>

        {/* HUD crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 animate-hud-pulse">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-5 bg-primary/15" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-5 bg-primary/15" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[1px] bg-primary/15" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-[1px] bg-primary/15" />
          <div className="absolute inset-[30%] rounded-full border border-primary/[0.08]" />
        </div>

        {/* Formation jets — V-shape */}
        <div className="absolute top-[14%] left-0 w-full animate-fly-loop" style={{ animationDuration: "9s" }}>
          <img src={armyJet} alt="" className="h-14 w-14 opacity-20" />
        </div>
        <div className="absolute top-[17%] left-0 w-full animate-fly-loop" style={{ animationDuration: "9s", animationDelay: "0.3s" }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-15 ml-8 mt-3" />
        </div>
        <div className="absolute top-[17%] left-0 w-full animate-fly-loop" style={{ animationDuration: "9s", animationDelay: "0.6s" }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-12 ml-4 mt-8" />
        </div>

        {/* Banking jet */}
        <div className="absolute top-[45%] left-0 w-full animate-bank-left" style={{ animationDuration: "11s", animationDelay: "3s" }}>
          <img src={armyJet} alt="" className="h-12 w-12 opacity-[0.18] ml-[25%]" />
        </div>

        {/* Reverse jets */}
        <div className="absolute top-[65%] left-0 w-full animate-fly-reverse" style={{ animationDuration: "10s", animationDelay: "2s" }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-[0.14] ml-[65%]" />
        </div>
        <div className="absolute top-[80%] left-0 w-full animate-fly-reverse" style={{ animationDuration: "12s", animationDelay: "7s" }}>
          <img src={armyJet} alt="" className="h-8 w-8 opacity-[0.1] ml-[40%]" />
        </div>

        {/* Extra looping jets */}
        <div className="absolute top-[35%] left-0 w-full animate-fly-across" style={{ animationDuration: "8s", animationDelay: "5s" }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-[0.12] ml-auto mr-[12%]" />
        </div>
        <div className="absolute top-[88%] left-0 w-full animate-fly-across" style={{ animationDuration: "7.5s", animationDelay: "9s" }}>
          <img src={armyJet} alt="" className="h-8 w-8 opacity-[0.08] ml-[55%]" />
        </div>

        {/* Helicopters with spinning rotors */}
        <div className="absolute top-[22%] right-[10%] animate-heli-drift" style={{ animationDuration: "10s" }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-16 w-16 opacity-[0.18]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-[2px] bg-primary/20 animate-rotor-spin origin-center" />
          </div>
        </div>
        <div className="absolute top-[58%] left-[6%] animate-heli-drift" style={{ animationDuration: "12s", animationDelay: "4s" }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-12 w-12 opacity-[0.12] -scale-x-100" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-primary/15 animate-rotor-spin origin-center" style={{ animationDelay: "0.05s" }} />
          </div>
        </div>
        <div className="absolute top-[78%] right-[28%] animate-heli-drift" style={{ animationDuration: "9s", animationDelay: "7s" }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-10 w-10 opacity-[0.1]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-primary/12 animate-rotor-spin origin-center" style={{ animationDelay: "0.08s" }} />
          </div>
        </div>

        {/* Contrails */}
        <div className="absolute top-[20%] left-[5%] w-[55%] h-[1px] animate-contrail" style={{ animationDuration: "7s" }}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        </div>
        <div className="absolute top-[50%] right-[5%] w-[45%] h-[1px] animate-contrail" style={{ animationDuration: "9s", animationDelay: "3s" }}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        </div>

        {/* Clouds */}
        <div className="absolute top-[15%] left-[8%] animate-drift-cloud">
          <Cloud className="h-14 w-14 text-muted-foreground/10" />
        </div>
        <div className="absolute top-[45%] right-[5%] animate-drift-cloud-slow">
          <Cloud className="h-20 w-20 text-muted-foreground/[0.06]" />
        </div>
        <div className="absolute bottom-[18%] left-[20%] animate-drift-cloud" style={{ animationDelay: "3s" }}>
          <Cloud className="h-12 w-12 text-muted-foreground/[0.08]" />
        </div>
        <div className="absolute top-[70%] right-[25%] animate-drift-cloud-slow" style={{ animationDelay: "1.5s" }}>
          <Cloud className="h-10 w-10 text-muted-foreground/[0.07]" />
        </div>
        <div className="absolute top-[8%] right-[15%] animate-drift-cloud" style={{ animationDelay: "4s" }}>
          <Cloud className="h-16 w-16 text-muted-foreground/[0.05]" />
        </div>

        {/* Twinkling particles */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-twinkle"
            style={{
              width: `${2 + (i % 4) * 1.5}px`,
              height: `${2 + (i % 4) * 1.5}px`,
              top: `${8 + (i * 6) % 85}%`,
              left: `${4 + (i * 12) % 92}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${1.5 + (i % 4)}s`,
            }}
          />
        ))}

        {/* Rising particles */}
        {[...Array(7)].map((_, i) => (
          <div
            key={`rise-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/15 animate-rise"
            style={{
              left: `${10 + i * 13}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${9 + i * 1.5}s`,
            }}
          />
        ))}

        {/* Flight paths */}
        <svg className="absolute top-[18%] left-[5%] w-[90%] h-[160px] opacity-[0.05]" viewBox="0 0 900 160">
          <path d="M0,80 Q225,10 450,80 T900,60" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
        <svg className="absolute bottom-[22%] left-[5%] w-[90%] h-[140px] opacity-[0.04]" viewBox="0 0 900 140">
          <path d="M0,70 Q300,140 600,50 T900,90" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="6 10" />
        </svg>
        <svg className="absolute top-[40%] left-[12%] w-[75%] h-[200px] opacity-[0.04]" viewBox="0 0 600 200">
          <path d="M0,100 C150,0 250,200 400,100 S550,0 600,100" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="5 8" />
        </svg>

        {/* Runway markers */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8 opacity-[0.04]">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1.5 h-16 bg-primary rounded-full" />
          ))}
        </div>
      </div>

      {/* ── Sign-in card ── */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl warm-shadow border-border/50 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-float warm-shadow">
              <img src={skynetLogo} alt="Skynet EPR" className="h-9 w-9" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Skynet</CardTitle>
          <CardDescription className="text-sm">
            Sign in to your EPR account — AIRMAN Academy
          </CardDescription>
          <div className="flex items-center justify-center gap-5 text-[10px] text-muted-foreground/50 pt-1">
            <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Students</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Instructors</span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-4 rounded-xl">
              <TabsTrigger value="login" className="flex-1 rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 rounded-lg">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Password</Label>
                  <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="rounded-xl h-10" />
                </div>
                <Button className="w-full rounded-xl h-11 font-semibold" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} required className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Password</Label>
                  <Input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Role</Label>
                  <Select value={signupRole} onValueChange={setSignupRole}>
                    <SelectTrigger className="rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full rounded-xl h-11 font-semibold" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
