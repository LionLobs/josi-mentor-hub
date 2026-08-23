import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Circle, Clock, FileDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MediaPlayer } from "@/components/media-player";
import { getSignedUrl } from "@/lib/storage";

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
            "id, title, description, course_modules(id, title, description, video_url, storage_path, duration_min, position)",
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
    if (!url) return toast.error("Arquivo indisponível");
    window.open(url, "_blank", "noopener");
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando…</p>;
  if (!data?.course) return <p className="text-sm text-muted-foreground">Curso não encontrado.</p>;

  const modules = [...(data.course.course_modules ?? [])].sort(
    (a: any, b: any) => a.position - b.position,
  );
  const active = modules.find((m: any) => m.id === activeId) ?? modules[0];
  const completed = modules.filter((m: any) => data.progress.has(m.id)).length;

  return (
    <div>
      <Link
        to="/aluno/cursos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar aos cursos
      </Link>

      <h1 className="mt-3 text-2xl sm:text-3xl">{data.course.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {completed} de {modules.length} aulas concluídas
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {active ? (
            <>
              <MediaPlayer
                videoUrl={active.video_url}
                storagePath={active.storage_path}
                title={active.title}
              />
              <div className="rounded-xl border bg-card p-5 shadow-elegant">
                <h2 className="text-lg font-medium">{active.title}</h2>
                {active.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{active.description}</p>
                )}
                <Button
                  variant={data.progress.has(active.id) ? "outline" : "gold"}
                  size="sm"
                  className="mt-4"
                  disabled={toggle.isPending}
                  onClick={() =>
                    toggle.mutate({
                      moduleId: active.id,
                      done: !data.progress.has(active.id),
                    })
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {data.progress.has(active.id) ? "Concluída" : "Marcar como concluída"}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Aulas em breve.</p>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-4 shadow-elegant">
            <p className="px-1 pb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Conteúdo do curso
            </p>
            <div className="space-y-1">
              {modules.map((m: any, i: number) => {
                const done = data.progress.has(m.id);
                const isActive = active && m.id === active.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveId(m.id)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors ${
                      isActive ? "bg-accent" : "hover:bg-accent/60"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {i + 1}. {m.title}
                      </span>
                      {m.duration_min && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {m.duration_min} min
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
              {modules.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">Módulos em breve.</p>
              )}
            </div>
          </div>

          {data.materials.length > 0 && (
            <div className="rounded-xl border bg-card p-4 shadow-elegant">
              <p className="px-1 pb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Materiais do curso
              </p>
              {data.materials.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => void openMaterial(m)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm hover:bg-accent"
                >
                  <FileDown className="h-4 w-4 shrink-0 text-gold" />
                  <span className="truncate">{m.title}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
