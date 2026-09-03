import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { dateTimeBR } from "@/lib/format";
import { Calendar, Video, Clock, ExternalLink, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { BookingWidget } from "@/components/booking-widget";

export const Route = createFileRoute("/aluno/agenda")({
  component: StudentAgenda,
});

function StudentAgenda() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["aluno-agenda"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("id, title, scheduled_at, duration_min, status, meeting_url, notes")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upcoming = data.filter(s => new Date(s.scheduled_at) >= new Date());
  const past = data.filter(s => new Date(s.scheduled_at) < new Date());

  const { data: myBookings = [] } = useQuery({
    queryKey: ["meus-agendamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, starts_at, duration_min, status, services(name)")
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="pb-20">
      <div className="mb-12">
        <p className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-2">Seus Encontros</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white">Agenda de <span className="text-gold italic">Mentoria</span></h1>
      </div>

      <section className="mb-16">
        <BookingWidget />

        {myBookings.length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-white">
              <CalendarCheck className="h-5 w-5 text-gold" /> Meus agendamentos
            </h2>
            <div className="space-y-2">
              {myBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm text-white/80">{b.services?.name ?? "Atendimento"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{dateTimeBR(b.starts_at)} · {b.duration_min} min</p>
                  </div>
                  <span className="rounded-full border border-gold/25 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>


      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-serif text-white mb-6 px-1 flex items-center gap-3">
               <Calendar className="h-6 w-6 text-gold" /> Próximas Sessões
            </h2>
            
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />)}
              </div>
            )}

            {!isLoading && upcoming.length === 0 && (
              <div className="py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                <Calendar className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-muted-foreground">Tudo certo por aqui! Nenhuma sessão pendente.</p>
              </div>
            )}

            <div className="space-y-4">
              {upcoming.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6 shadow-elegant hover:bg-white/5 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 text-gold shrink-0">
                        <span className="text-xs font-bold uppercase">{new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                        <span className="text-2xl font-bold leading-none">{new Date(s.scheduled_at).getDate()}</span>
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors truncate">{s.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {dateTimeBR(s.scheduled_at).split(' às ')[1]}</span>
                          <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {s.duration_min} min</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          <span className="text-gold">{s.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {s.meeting_url ? (
                      <a 
                        href={s.meeting_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gold transition-colors shrink-0"
                      >
                        Entrar na Sala <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest cursor-default">
                        Link em breve
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif text-white/40 mb-6 px-1">Sessões Concluídas</h2>
              <div className="space-y-3">
                {past.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                         <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">{s.title}</p>
                        <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{dateTimeBR(s.scheduled_at)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-500/50 font-bold uppercase border border-emerald-500/20 px-2 py-0.5 rounded-full">Finalizada</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
           <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-serif text-white mb-6">Informações Úteis</h3>
              <div className="space-y-6">
                 <div>
                   <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Pontualidade</p>
                   <p className="text-sm text-white/60 leading-relaxed">Recomendamos entrar na sala 5 minutos antes do início para testar áudio e vídeo.</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Gravações</p>
                   <p className="text-sm text-white/60 leading-relaxed">As sessões gravadas serão disponibilizadas na aba de cursos em até 24h após o encontro.</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Reagendamento</p>
                   <p className="text-sm text-white/60 leading-relaxed">Solicitações de mudança de data devem ser feitas com no mínimo 48h de antecedência.</p>
                 </div>
              </div>
           </div>

           <div className="rounded-3xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 p-8 text-center">
              <Video className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Dificuldade com o Link?</h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">Se o botão "Entrar na Sala" não estiver funcionando, entre em contato via WhatsApp suporte.</p>
              <button className="w-full py-3 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">
                Suporte Técnico
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}
