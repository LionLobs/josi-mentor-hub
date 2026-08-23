import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Wallet, CalendarDays, Crown, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl, dateTimeBR } from "@/lib/format";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [students, mentorships, sessions, payments] = await Promise.all([
        supabase.from("students").select("id, status"),
        supabase.from("mentorships").select("id, status"),
        supabase
          .from("sessions")
          .select("id, title, scheduled_at, status, students(full_name)")
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(6),
        supabase.from("payments").select("amount_cents, status, paid_at"),
      ]);
      return {
        students: students.data ?? [],
        mentorships: mentorships.data ?? [],
        sessions: sessions.data ?? [],
        payments: payments.data ?? [],
      };
    },
  });

  const students = data?.students ?? [];
  const payments = data?.payments ?? [];
  const recebido = payments
    .filter((p) => p.status === "pago")
    .reduce((s, p) => s + (p.amount_cents ?? 0), 0);
  const aReceber = payments
    .filter((p) => p.status !== "pago")
    .reduce((s, p) => s + (p.amount_cents ?? 0), 0);

  const stats = [
    { 
      label: "Alunos Ativos", 
      value: students.filter((s) => s.status === "ativo").length, 
      icon: Users,
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Mentorias", 
      value: (data?.mentorships ?? []).length, 
      icon: Crown,
      trend: "Estável",
      trendUp: true
    },
    { 
      label: "Faturamento", 
      value: brl(recebido), 
      icon: Wallet,
      trend: "+8.5%",
      trendUp: true
    },
    { 
      label: "Previsão", 
      value: brl(aReceber), 
      icon: CalendarDays,
      trend: "-2%",
      trendUp: false
    },
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-2">Painel de Controle</p>
          <h1 className="text-4xl font-serif text-white">Visão <span className="text-gold italic">Estratégica</span></h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
           <Activity className="h-4 w-4 text-gold animate-pulse" />
           <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Sistema Operacional</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6 shadow-elegant hover:bg-white/5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors duration-500">
                <s.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.trendUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                {s.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.trend}
              </div>
            </div>
            
            <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">{s.label}</p>
            <p className="font-serif mt-1 text-3xl text-white">{s.value}</p>
            
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <s.icon className="h-24 w-24 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Next Sessions */}
        <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-card p-8 shadow-elegant">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-white">Próximos <span className="text-gold">Encontros</span></h2>
            <TrendingUp className="h-5 w-5 text-gold/20" />
          </div>
          
          <div className="space-y-4">
            {isLoading && [1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
            
            {!isLoading && (data?.sessions ?? []).length === 0 && (
              <p className="text-sm text-white/20 italic py-10 text-center border border-dashed border-white/5 rounded-2xl">
                Nenhuma sessão agendada no horizonte.
              </p>
            )}
            
            {(data?.sessions ?? []).map((s: any) => (
              <div
                key={s.id}
                className="group flex items-center gap-6 p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-gold text-[10px] font-bold border border-white/10">
                   <span className="uppercase">{new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                   <span className="text-lg leading-none">{new Date(s.scheduled_at).getDate()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate group-hover:text-gold transition-colors">{s.title}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
                    {s.students?.full_name ?? "Sessão de Grupo"}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                   <p className="text-xs font-bold text-white/60">{dateTimeBR(s.scheduled_at).split(' às ')[1]}</p>
                   <button className="mt-1 text-[9px] font-bold text-gold uppercase tracking-tighter border-b border-gold/30 hover:border-gold transition-all">
                      Detalhes
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-8">
           <div className="rounded-[2.5rem] border border-white/10 bg-gold p-8 text-black">
              <h3 className="text-xl font-serif mb-6">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                    <Users className="h-5 w-5 mb-2" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center">Novo Aluno</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                    <CalendarDays className="h-5 w-5 mb-2" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center">Nova Sessão</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                    <GraduationCap className="h-5 w-5 mb-2" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center">Subir Aula</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black hover:text-white transition-all duration-300">
                    <Settings className="h-5 w-5 mb-2" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-center">Ajustes</span>
                 </button>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                 <Activity className="h-32 w-32 text-white" />
              </div>
              <h3 className="text-xl font-serif text-white mb-6">Status do Sistema</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Base de Dados</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Integrador Kiwify</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ativo
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Armazenamento</span>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> 85% Full
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Simple Settings icon since it was used but not imported
function Settings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
