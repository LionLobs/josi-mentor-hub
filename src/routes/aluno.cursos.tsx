import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/aluno/cursos")({
  component: StudentCourses,
});

function StudentCourses() {
  const { data = [] } = useQuery({
    queryKey: ["aluno-cursos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, cover_url, course_modules(id, title, description, video_url, position)")
        .eq("published", true);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Meus cursos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Aulas liberadas para você.</p>

      <div className="mt-6 space-y-6">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum curso disponível ainda.</p>
        )}
        {data.map((course: any) => (
          <div key={course.id} className="rounded-xl border bg-card p-6 shadow-elegant">
            <h2 className="text-xl">{course.title}</h2>
            {course.description && (
              <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[...(course.course_modules ?? [])]
                .sort((a: any, b: any) => a.position - b.position)
                .map((m: any) => (
                  <a
                    key={m.id}
                    href={m.video_url ?? "#"}
                    target={m.video_url ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{m.title}</p>
                      {m.description && (
                        <p className="text-sm text-muted-foreground">{m.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              {(course.course_modules ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">Módulos em breve.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
