import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { dateTimeBR } from "@/lib/format";

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
        supabase.from("courses").select("id, title").eq("published", true).limit(4),
      ]);
      return {
        enrollments: enrollments.data ?? [],
        sessions: sessions.data ?? [],
        courses: courses.data ?? [],
      };
    },
  });

  return (
    <div>
      <p className="text-xs tracking-[0.3em] text-muted-foreground">BEM-VINDA</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">Sua jornada de mentoria</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-xl">Minhas mentorias</h2>
          <div className="mt-4 space-y-3">
            {(data?.enrollments ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma mentoria ativa no momento.</p>
            )}
            {(data?.enrollments ?? []).map((e: any) => (
              <div key={e.id} className="border-b pb-3 last:border-0">
                <p className="font-medium">{e.mentorships?.title ?? "Mentoria"}</p>
                <p className="text-sm text-muted-foreground capitalize">{e.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-xl">Próximos encontros</h2>
          <div className="mt-4 space-y-3">
            {(data?.sessions ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma sessão agendada.</p>
            )}
            {(data?.sessions ?? []).map((s: any) => (
              <div key={s.id} className="border-b pb-3 last:border-0">
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{dateTimeBR(s.scheduled_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-card p-6 shadow-elegant">
        <h2 className="text-xl">Continue estudando</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(data?.courses ?? []).map((c) => (
            <Link
              key={c.id}
              to="/aluno/cursos"
              className="rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-muted-foreground">Acessar aulas</p>
            </Link>
          ))}
          {(data?.courses ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum curso publicado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
