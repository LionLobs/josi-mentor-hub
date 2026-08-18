import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { dateTimeBR } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/aluno/agenda")({
  component: StudentAgenda,
});

function StudentAgenda() {
  const { data = [] } = useQuery({
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

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Minha agenda</h1>
      <p className="mt-1 text-sm text-muted-foreground">Todas as suas sessões de mentoria.</p>

      <div className="mt-6 space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma sessão agendada.</p>
        )}
        {data.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-5 shadow-elegant"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{s.title}</p>
              <p className="text-sm text-muted-foreground">
                {dateTimeBR(s.scheduled_at)} · {s.duration_min} min · {s.status}
              </p>
            </div>
            {s.meeting_url && (
              <Button variant="gold" size="sm" asChild className="shrink-0">
                <a href={s.meeting_url} target="_blank" rel="noreferrer">
                  Entrar
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
