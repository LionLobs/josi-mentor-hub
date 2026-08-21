import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogOut, type LucideIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo-horiz.png.asset.json";

export type NavItem = { to: string; label: string; icon: LucideIcon };

export function AppShell({ items, area }: { items: NavItem[]; area: string }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#fcfdfc]">
      <aside className="surface-ink relative w-full shrink-0 md:min-h-screen md:w-72 shadow-2xl z-10">
        <div className="px-8 py-10">
          <img
            src={logoAsset.url}
            alt="Josi Nascimento — Massoterapia Avançada"
            className="h-10 w-auto brightness-110 contrast-125"
          />
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-[9px] font-bold tracking-[0.4em] text-gold uppercase whitespace-nowrap">{area}</p>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 px-4 pb-8 md:flex-col md:flex-nowrap">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  active 
                    ? "bg-white/10 text-gold shadow-lux ring-1 ring-white/10" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-gold" : ""}`} />
                <span className="truncate tracking-wide">{item.label}</span>
                {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-10">
          <div className="rounded-2xl bg-white/5 p-1 mb-4">
             <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start rounded-xl py-6 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold tracking-widest uppercase">Sair da Sessão</span>
            </Button>
          </div>
          <div className="px-4 text-[9px] text-white/20 text-center uppercase tracking-[0.2em]">
            Josi Nascimento © {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-background relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10 -ml-64 -mb-64" />
        
        <div className="px-6 py-10 md:px-12 md:py-16 max-w-7xl mx-auto min-h-full flex flex-col">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
