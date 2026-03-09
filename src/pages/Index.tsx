import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonList } from "@/components/PersonList";
import { PersonDetails } from "@/components/PersonDetails";
import { PerformanceSummary } from "@/components/PerformanceSummary";
import { EPRList } from "@/components/EPRList";
import { EPRModal } from "@/components/EPRModal";
import { usePeople, usePersonEprs } from "@/hooks/use-people";
import { Person, EprRecord } from "@/lib/api";
import { Search, Plus, FileText, Menu, ArrowLeft, LogOut, Cloud, GraduationCap, Shield } from "lucide-react";
import skynetLogo from "@/assets/skynet-logo.png";
import armyJet from "@/assets/army-jet.png";
import helicopter from "@/assets/helicopter.png";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppUser } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface IndexProps {
  appUser: AppUser;
  onSignOut: () => void;
}

const Index = ({ appUser, onSignOut }: IndexProps) => {
  const isStudent = appUser.role === "student";
  const isInstructorOrAdmin = appUser.role === "instructor" || appUser.role === "admin";

  const [roleFilter, setRoleFilter] = useState("student");
  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [eprModalOpen, setEprModalOpen] = useState(false);
  const [editingEpr, setEditingEpr] = useState<EprRecord | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: people = [], isLoading: loadingPeople } = usePeople(
    isStudent ? undefined : roleFilter,
    isStudent ? undefined : search
  );

  const effectivePerson = isStudent
    ? people.find((p) => p.id === appUser.id) ?? null
    : selectedPerson;

  const { data: eprs = [], isLoading: loadingEprs } = usePersonEprs(effectivePerson?.id);

  const handleSelectEpr = (epr: EprRecord) => {
    setEditingEpr(epr);
    setEprModalOpen(true);
  };

  const handleNewEpr = () => {
    setEditingEpr(null);
    setEprModalOpen(true);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    if (isMobile) setSidebarOpen(false);
  };

  const userHeader = (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold truncate">{appUser.name}</span>
        <Badge variant="secondary" className="text-[10px] capitalize shrink-0 rounded-full">{appUser.role}</Badge>
      </div>
      <Button variant="ghost" size="icon" onClick={onSignOut} className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );

  const sidebarContent = (
    <>
      {userHeader}
      {isInstructorOrAdmin && (
        <div className="p-3 space-y-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm rounded-xl"
            />
          </div>
          <Tabs value={roleFilter} onValueChange={setRoleFilter}>
            <TabsList className="w-full rounded-xl">
              <TabsTrigger value="student" className="flex-1 text-xs rounded-lg">Students</TabsTrigger>
              <TabsTrigger value="instructor" className="flex-1 text-xs rounded-lg">Instructors</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {isInstructorOrAdmin && (
          <PersonList
            people={people}
            selectedId={selectedPerson?.id}
            onSelect={handleSelectPerson}
            isLoading={loadingPeople}
          />
        )}
      </div>
    </>
  );

  const personToShow = effectivePerson;

  const mainContent = personToShow ? (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {isMobile && isInstructorOrAdmin && (
        <Button variant="ghost" size="sm" onClick={() => { setSelectedPerson(null); setSidebarOpen(true); }} className="gap-1.5 -ml-2 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      )}
      <PersonDetails person={personToShow} />
      <PerformanceSummary personId={personToShow.id} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Performance Records
          </h3>
          {isInstructorOrAdmin && personToShow.role === "student" && (
            <Button size="sm" onClick={handleNewEpr} className="gap-1.5 text-xs rounded-xl">
              <Plus className="h-3.5 w-3.5" />
              New EPR
            </Button>
          )}
        </div>
        <EPRList eprs={eprs} isLoading={loadingEprs} onSelect={handleSelectEpr} />
      </div>
      {isInstructorOrAdmin && (
        <EPRModal
          open={eprModalOpen}
          onOpenChange={setEprModalOpen}
          personId={personToShow.id}
          personName={personToShow.name}
          epr={editingEpr}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 relative overflow-hidden">
      {isMobile && isInstructorOrAdmin && (
        <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 gap-1.5 rounded-xl z-10">
          <Menu className="h-4 w-4" /> Directory
        </Button>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radar rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-radar-ping" />
          <div className="absolute inset-8 rounded-full border border-primary/8 animate-radar-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-16 rounded-full border border-primary/6 animate-radar-ping" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-24 rounded-full border border-primary/[0.04] animate-radar-ping" style={{ animationDelay: '3s' }} />
        </div>

        {/* Radar sweep line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
          <div className="absolute inset-0 animate-sweep origin-center">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-primary/20 to-transparent origin-left" />
          </div>
        </div>

        {/* HUD crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 animate-hud-pulse">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-primary/20" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-primary/20" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-primary/20" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-primary/20" />
          <div className="absolute inset-[30%] rounded-full border border-primary/10" />
        </div>

        {/* Flying jets — looping formations */}
        <div className="absolute top-[12%] left-0 w-full animate-fly-loop" style={{ animationDuration: '8s' }}>
          <img src={armyJet} alt="" className="h-16 w-16 opacity-25" />
        </div>
        <div className="absolute top-[15%] left-0 w-full animate-fly-loop" style={{ animationDuration: '8s', animationDelay: '0.3s' }}>
          <img src={armyJet} alt="" className="h-12 w-12 opacity-18 ml-10 mt-4" />
        </div>
        <div className="absolute top-[15%] left-0 w-full animate-fly-loop" style={{ animationDuration: '8s', animationDelay: '0.6s' }}>
          <img src={armyJet} alt="" className="h-12 w-12 opacity-15 ml-5 mt-10" />
        </div>

        {/* Banking jet */}
        <div className="absolute top-[40%] left-0 w-full animate-bank-left" style={{ animationDuration: '12s', animationDelay: '4s' }}>
          <img src={armyJet} alt="" className="h-14 w-14 opacity-20 ml-[30%]" />
        </div>

        {/* Reverse direction jets */}
        <div className="absolute top-[60%] left-0 w-full animate-fly-reverse" style={{ animationDuration: '10s', animationDelay: '2s' }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-[0.14] ml-[70%]" />
        </div>
        <div className="absolute top-[75%] left-0 w-full animate-fly-reverse" style={{ animationDuration: '13s', animationDelay: '7s' }}>
          <img src={armyJet} alt="" className="h-12 w-12 opacity-[0.1] ml-[40%]" />
        </div>

        {/* Original looping jets at other altitudes */}
        <div className="absolute top-[30%] left-0 w-full animate-fly-across" style={{ animationDuration: '9s', animationDelay: '5s' }}>
          <img src={armyJet} alt="" className="h-10 w-10 opacity-[0.12] ml-auto mr-[15%]" />
        </div>
        <div className="absolute top-[85%] left-0 w-full animate-fly-across" style={{ animationDuration: '7s', animationDelay: '9s' }}>
          <img src={armyJet} alt="" className="h-8 w-8 opacity-[0.1] ml-[50%]" />
        </div>

        {/* Orbiting jet around center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit" style={{ animationDuration: '25s' }}>
            <img src={armyJet} alt="" className="h-6 w-6 opacity-[0.08]" />
          </div>
        </div>

        {/* Contrails / vapor trails */}
        <div className="absolute top-[18%] left-[5%] w-[60%] h-[1px] animate-contrail" style={{ animationDuration: '7s' }}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        </div>
        <div className="absolute top-[45%] right-[5%] w-[50%] h-[1px] animate-contrail" style={{ animationDuration: '9s', animationDelay: '3s' }}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        </div>
        <div className="absolute top-[70%] left-[15%] w-[40%] h-[1px] animate-contrail" style={{ animationDuration: '8s', animationDelay: '6s' }}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
        </div>

        {/* Clouds */}
        <div className="absolute top-[12%] left-[8%] animate-drift-cloud">
          <Cloud className="h-14 w-14 text-muted-foreground/15" />
        </div>
        <div className="absolute top-[40%] right-[5%] animate-drift-cloud-slow">
          <Cloud className="h-20 w-20 text-muted-foreground/10" />
        </div>
        <div className="absolute bottom-[25%] left-[25%] animate-drift-cloud" style={{ animationDelay: '2s' }}>
          <Cloud className="h-10 w-10 text-muted-foreground/12" />
        </div>
        <div className="absolute top-[60%] left-[60%] animate-drift-cloud-slow" style={{ animationDelay: '1s' }}>
          <Cloud className="h-16 w-16 text-muted-foreground/[0.07]" />
        </div>
        <div className="absolute top-[5%] right-[20%] animate-drift-cloud" style={{ animationDelay: '4s' }}>
          <Cloud className="h-12 w-12 text-muted-foreground/[0.09]" />
        </div>

        {/* Helicopters with spinning rotors */}
        <div className="absolute top-[20%] right-[12%] animate-heli-drift" style={{ animationDuration: '10s' }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-16 w-16 opacity-[0.18]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-[2px] bg-primary/20 animate-rotor-spin origin-center" />
          </div>
        </div>
        <div className="absolute top-[55%] left-[8%] animate-heli-drift" style={{ animationDuration: '12s', animationDelay: '4s' }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-12 w-12 opacity-[0.12] -scale-x-100" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-primary/15 animate-rotor-spin origin-center" style={{ animationDelay: '0.05s' }} />
          </div>
        </div>
        <div className="absolute top-[80%] right-[30%] animate-heli-drift" style={{ animationDuration: '9s', animationDelay: '7s' }}>
          <div className="relative">
            <img src={helicopter} alt="" className="h-10 w-10 opacity-[0.1]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-[1.5px] bg-primary/12 animate-rotor-spin origin-center" style={{ animationDelay: '0.08s' }} />
          </div>
        </div>

        {/* Twinkling particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-twinkle"
            style={{
              width: `${2 + (i % 4) * 1.5}px`,
              height: `${2 + (i % 4) * 1.5}px`,
              top: `${5 + (i * 5.5) % 90}%`,
              left: `${3 + (i * 11) % 94}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${1.5 + (i % 4)}s`,
            }}
          />
        ))}

        {/* Rising particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`rise-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/15 animate-rise"
            style={{
              left: `${8 + i * 12}%`,
              animationDelay: `${i * 1.8}s`,
              animationDuration: `${8 + i * 1.5}s`,
            }}
          />
        ))}

        {/* Dotted flight paths */}
        <svg className="absolute top-[22%] left-[5%] w-[90%] h-[200px] opacity-[0.06]" viewBox="0 0 800 200">
          <path d="M0,100 Q200,20 400,100 T800,80" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
        <svg className="absolute bottom-[15%] left-[5%] w-[90%] h-[150px] opacity-[0.04]" viewBox="0 0 800 150">
          <path d="M0,75 Q300,150 600,50 T800,90" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="6 10" />
        </svg>
        <svg className="absolute top-[55%] left-[10%] w-[80%] h-[120px] opacity-[0.03]" viewBox="0 0 700 120">
          <path d="M0,60 Q175,10 350,70 T700,40" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 12" />
        </svg>
        {/* Curved loop path */}
        <svg className="absolute top-[35%] left-[15%] w-[70%] h-[250px] opacity-[0.05]" viewBox="0 0 600 250">
          <path d="M0,125 C150,0 250,250 400,125 S550,0 600,125" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="5 8" />
        </svg>

        {/* Runway markers */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8 opacity-[0.04]">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1.5 h-16 bg-primary rounded-full" />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 animate-fade-in-up">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 mb-6 mx-auto animate-float warm-shadow">
          <img src={skynetLogo} alt="Skynet EPR" className="h-14 w-14" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Skynet EPR</h2>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed mb-6">
          Select a person from the directory to view their performance records,
          create new EPRs, and track training progress.
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Students</span>
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Instructors</span>
          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Records</span>
        </div>
      </div>
    </div>
  );

  if (isStudent) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
               <img src={skynetLogo} alt="Skynet EPR" className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm">Skynet EPR</span>
            <Badge variant="secondary" className="text-[10px] capitalize rounded-full">{appUser.role}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{appUser.name}</span>
            <Button variant="ghost" size="icon" onClick={onSignOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main>{mainContent}</main>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <SheetHeader className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <img src={skynetLogo} alt="Skynet EPR" className="h-5 w-5" />
                </div>
                <SheetTitle className="text-base font-bold">Skynet EPR</SheetTitle>
              </div>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>

        {!selectedPerson && !sidebarOpen && (
          <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <img src={skynetLogo} alt="Skynet EPR" className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm">Skynet EPR</span>
            </div>
          </header>
        )}

        <main>{mainContent}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-80 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <img src={skynetLogo} alt="Skynet EPR" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Skynet EPR</h1>
            <p className="text-[11px] text-muted-foreground">AIRMAN Academy</p>
          </div>
        </div>
        {sidebarContent}
      </aside>
      <main className="flex-1 overflow-y-auto">{mainContent}</main>
    </div>
  );
};

export default Index;
