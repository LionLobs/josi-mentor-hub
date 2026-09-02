import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { dateTimeBR } from "@/lib/format";
import { PlayCircle, Calendar, GraduationCap, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

// Assets for background/hero
import josiHomeHero from "@/assets/josi_nascimento_40_anos-31.jpg";
import josiPoster1 from "@/assets/josi_nascimento_40_anos-26.jpg";

export const Route = createFileRoute("/aluno/")({
  component: StudentHome,
});

function StudentHome() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["aluno-home", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [enrollments, sessions, courses] = await Promise.all([
        supabase.from("enrollments").select("id, status, start_date, mentorships(title)"),
        supabase
          .from("sessions")
          .select("id, title, scheduled_at, meeting_url")
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(4),
        supabase.from("courses").select("id, title, description, cover_url").eq("published", true).limit(4),
      ]);
      return {
        enrollments: enrollments.data ?? [],
        sessions: sessions.data ?? [],
        courses: courses.data ?? [],
      };
    },
  });

  const nextSession = data?.sessions?.[0];

  return (
    <div className="pb-20">
      {/* Welcome Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-lux">
        <div className="absolute inset-0 z-0">
          <img 
            src={josiHomeHero} 
            className="h-full w-full object-cover opacity-40 brightness-50"
            alt="Welcome Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 px-8 py-16 md:px-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-4">Bem-vinda de volta</p>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Sua evolução técnica <br />
              começa <span className="text-gold italic">aqui.</span>
            </h1>
            
            {nextSession ? (
              <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-gold flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-black" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Próximo Encontro</p>
                  <p className="text-sm font-medium text-white">{dateTimeBR(nextSession.scheduled_at)}</p>
                </div>
                <Link
                  to="/aluno/agenda"
                  className="ml-4 h-8 w-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-gold transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <p className="text-white/60 max-w-lg mt-4">
                Pronta para elevar o seu nível profissional? Explore seus cursos e materiais exclusivos abaixo.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-2xl font-serif text-white">Cursos em <span className="text-gold">Andamento</span></h2>
              <Link to="/aluno/cursos" className="text-xs font-bold tracking-widest text-gold hover:text-white transition-colors uppercase">Ver Todos</Link>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {(data?.courses ?? []).map((course: any, idx) => (
                <Link
                  key={course.id}
                  to="/aluno/cursos/$courseId"
                  params={{ courseId: course.id }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-4 transition-all hover:bg-white/5"
                >
                  <div className="flex gap-4">
                    <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <img 
                        src={idx === 0 ? josiPoster1 : course.cover_url} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="font-bold text-white truncate">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Acessar videoaulas</p>
                    </div>
                  </div>
                </Link>
              ))}
              {(data?.courses ?? []).length === 0 && (
                <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-white/10">
                   <p className="text-sm text-muted-foreground">Nenhum curso disponível ainda.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-6 px-1">Novidades na <span className="text-gold">Comunidade</span></h2>
            <div className="rounded-3xl bg-gold p-8 md:p-12 text-black overflow-hidden relative">
               <Star className="absolute -top-10 -right-10 h-64 w-64 text-black/5" />
               <div className="relative z-10 max-w-md">
                 <h3 className="text-3xl font-serif mb-4">Nova Masterclass: Precificação de Luxo</h3>
                 <p className="text-black/80 mb-8">Aprenda como cobrar o valor justo pelo seu trabalho e atrair clientes que valorizam a sua arte.</p>
                 <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors">
                   Assistir Agora
                 </button>
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" /> Mentorias Ativas
            </h2>
            <div className="space-y-4">
              {(data?.enrollments ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma mentoria ativa no momento.</p>
              )}
              {(data?.enrollments ?? []).map((e: any) => (
                <div key={e.id} className="group cursor-default">
                  <p className="font-medium text-white group-hover:text-gold transition-colors">{e.mentorships?.title ?? "Mentoria"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{e.status}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/10">
              <h2 className="text-xl font-serif text-white mb-6">Agenda de Encontros</h2>
              <div className="space-y-6">
                {(data?.sessions ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">Fique atenta aos comunicados sobre novas datas.</p>
                )}
                {(data?.sessions ?? []).map((s: any) => (
                  <div key={s.id} className="flex gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-gold">
                      <span className="text-[10px] font-bold uppercase">{new Date(s.scheduled_at).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                      <span className="text-lg font-bold leading-none">{new Date(s.scheduled_at).getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{dateTimeBR(s.scheduled_at).split(' às ')[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="rounded-3xl border border-gold/20 bg-gold/5 p-8 text-center">
            <GraduationCap className="h-10 w-10 text-gold mx-auto mb-4" />
            <h3 className="font-bold text-white mb-2">Suporte à Aluna</h3>
            <p className="text-xs text-muted-foreground mb-6">Dúvidas técnicas ou acesso? Estamos aqui para ajudar.</p>
            <button className="w-full py-3 rounded-xl border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
              Falar com Suporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
