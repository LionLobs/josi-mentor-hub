import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Circle, Clock, FileDown, Play, ChevronRight, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MediaPlayer } from "@/components/media-player";
import { getSignedUrl } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/aluno/cursos/$courseId")({
  component: CoursePlayer,
});

function CoursePlayer() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["aluno-curso", courseId, user?.id],
    queryFn: async () => {
      const [courseRes, progressRes, materialsRes] = await Promise.all([
        supabase
          .from("courses")
          .select(
            "id, title, description, cover_url, course_modules(id, title, description, video_url, storage_path, duration_min, position)",
          )
          .eq("id", courseId)
          .eq("published", true)
          .maybeSingle(),
        supabase.from("lesson_progress").select("module_id, completed_at"),
        supabase
          .from("downloads")
          .select("id, title, file_url, storage_path")
          .eq("course_id", courseId)
          .eq("published", true),
      ]);
      if (courseRes.error) throw courseRes.error;
      return {
        course: courseRes.data,
        progress: new Set(
          (progressRes.data ?? []).filter((p: any) => p.completed_at).map((p: any) => p.module_id),
        ),
        materials: materialsRes.data ?? [],
      };
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ moduleId, done }: { moduleId: string; done: boolean }) => {
      if (!user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          module_id: moduleId,
          user_id: user.id,
          completed_at: done ? new Date().toISOString() : null,
        },
        { onConflict: "module_id,user_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["aluno-curso"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const openMaterial = async (m: any) => {
    const url = m.storage_path ? await getSignedUrl(m.storage_path) : m.file_url;
    if (!url) {
      toast.error("Arquivo indisponível");
      return;
    }
    window.open(url, "_blank", "noopener");
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center text-gold animate-pulse">Carregando experiência cinematográfica...</div>;
  if (!data?.course) return <div className="text-center py-20">Curso não encontrado.</div>;

  const modules = [...(data.course.course_modules ?? [])].sort(
    (a: any, b: any) => a.position - b.position,
  );
  const active = modules.find((m: any) => m.id === activeId) ?? modules[0];
  const completedCount = modules.filter((m: any) => data.progress.has(m.id)).length;
  const progressPct = modules.length ? (completedCount / modules.length) * 100 : 0;

  return (
    <div className="pb-20 max-w-full">
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/aluno/cursos"
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Link>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:block w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                className="h-full bg-gold shadow-[0_0_10px_var(--gold)]"
              />
           </div>
           <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">
             {completedCount} / {modules.length} CONCLUÍDAS
           </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Cinema Player Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-lux bg-black"
          >
            {active ? (
              <MediaPlayer
                videoUrl={active.video_url}
                storagePath={active.storage_path}
                title={active.title}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/20 italic">
                Aguardando liberação do conteúdo...
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">{active.title}</h1>
                    <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                       {active.duration_min && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {active.duration_min} MINUTOS</span>}
                       <span className="h-1 w-1 rounded-full bg-white/20" />
                       <span className="text-gold">Módulo {modules.indexOf(active) + 1}</span>
                    </div>
                  </div>
                  
                  <button
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate({
                        moduleId: active.id,
                        done: !data.progress.has(active.id),
                      })
                    }
                    className={`flex items-center gap-3 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                      data.progress.has(active.id) 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-gold text-black hover:bg-white"
                    }`}
                  >
                    {data.progress.has(active.id) ? (
                      <><CheckCircle2 className="h-4 w-4" /> Concluída</>
                    ) : (
                      "Marcar como Concluída"
                    )}
                  </button>
                </div>

                {active.description && (
                  <div className="mt-8 p-8 rounded-3xl bg-white/5 border border-white/10">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                       <Info className="h-3 w-3" /> Resumo da Aula
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm">{active.description}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Playlist Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-elegant overflow-hidden relative">
            <div className="flex items-center justify-between mb-6 px-2">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Conteúdo</h3>
               <span className="text-[10px] text-white/40 font-mono">{modules.length} AULAS</span>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {modules.map((m: any, i: number) => {
                const done = data.progress.has(m.id);
                const isActive = active && m.id === active.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveId(m.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                      isActive ? "bg-gold text-black shadow-[0_0_20px_rgba(202,176,108,0.2)]" : "hover:bg-white/5"
                    }`}
                  >
                    <div className={`relative h-10 w-10 shrink-0 rounded-xl flex items-center justify-center overflow-hidden border ${
                       isActive ? "bg-black/10 border-black/10" : "bg-white/5 border-white/10"
                    }`}>
                       {done && !isActive ? (
                         <CheckCircle2 className="h-4 w-4 text-gold" />
                       ) : (
                         <span className={`text-[10px] font-bold ${isActive ? "text-black" : "text-white/20"}`}>{i + 1}</span>
                       )}
                       {isActive && <Play className="h-3 w-3 fill-black text-black absolute" />}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-black" : "text-white"}`}>
                        {m.title}
                      </p>
                      <div className={`flex items-center gap-2 mt-1 text-[9px] font-bold uppercase tracking-tighter ${isActive ? "text-black/60" : "text-white/30"}`}>
                         {m.duration_min && <span>{m.duration_min} MIN</span>}
                         {done && !isActive && <span className="text-gold">• CONCLUÍDA</span>}
                      </div>
                    </div>
                    
                    {!isActive && <ChevronRight className="h-3 w-3 text-white/10 group-hover:text-gold transition-colors" />}
                  </button>
                );
              })}
              {modules.length === 0 && (
                <p className="p-8 text-center text-xs text-white/20 italic">Módulos em breve.</p>
              )}
            </div>
          </div>

          {data.materials.length > 0 && (
            <div className="rounded-[2rem] border border-white/10 bg-card p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 px-2">Materiais de Apoio</h3>
              <div className="space-y-2">
                {data.materials.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => void openMaterial(m)}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left text-xs text-white/60 border border-white/5 hover:bg-white/5 hover:text-gold transition-all"
                  >
                    <span className="truncate flex items-center gap-3">
                       <FileDown className="h-4 w-4 text-gold" /> {m.title}
                    </span>
                    <ArrowLeft className="h-3 w-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
