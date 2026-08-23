import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/aluno/cursos")({
  component: StudentCourses,
});

function StudentCourses() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["aluno-cursos", user?.id],
    queryFn: async () => {
      const [coursesRes, progressRes] = await Promise.all([
        supabase
          .from("courses")
          .select("id, title, description, cover_url, course_modules(id, title, position)")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase.from("lesson_progress").select("module_id").not("completed_at", "is", null),
      ]);
      if (coursesRes.error) throw coursesRes.error;
      return {
        courses: coursesRes.data ?? [],
        done: new Set((progressRes.data ?? []).map((p: any) => p.module_id)),
      };
    },
  });

  const courses = data?.courses ?? [];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Meus cursos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Videoaulas e módulos liberados para você, direto na plataforma.
      </p>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Carregando…</p>}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {!isLoading && courses.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum curso disponível ainda.</p>
        )}
        {courses.map((course: any) => {
          const modules = course.course_modules ?? [];
          const completed = modules.filter((m: any) => data?.done.has(m.id)).length;
          const pct = modules.length ? Math.round((completed / modules.length) * 100) : 0;
          return (
            <Link
              key={course.id}
              to="/aluno/cursos/$courseId"
              params={{ courseId: course.id }}
              className="group overflow-hidden rounded-2xl border bg-card shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-lux"
            >
              {course.cover_url ? (
                <img
                  src={course.cover_url}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted/40">
                  <GraduationCap className="h-8 w-8 text-gold" />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-medium">{course.title}</h2>
                {course.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {completed}/{modules.length} aulas
                  </span>
                </div>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-gold">
                  <PlayCircle className="h-4 w-4" /> Assistir agora
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
