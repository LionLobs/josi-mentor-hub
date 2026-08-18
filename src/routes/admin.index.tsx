import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Wallet, CalendarDays, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl, dateTimeBR } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
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

  const cards = [
    { icon: Users, label: "Alunos ativos", value: students.filter((s) => s.status === "ativo").length },
    { icon: Crown, label: "Mentorias", value: (data?.mentorships ?? []).length },
    { icon: Wallet, label: "Recebido", value: brl(recebido) },
    { icon: CalendarDays, label: "A receber", value: brl(aReceber) },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Visão geral</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Resumo do seu negócio de mentorias em tempo real.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-5 shadow-elegant">
            <c.icon className="h-5 w-5 text-gold" />
            <p className="mt-3 text-sm text-muted-foreground">{c.label}</p>
            <p className="font-display mt-1 text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6 shadow-elegant">
        <h2 className="text-xl">Próximas sessões</h2>
        <div className="mt-4 space-y-3">
          {(data?.sessions ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma sessão agendada.</p>
          )}
          {(data?.sessions ?? []).map((s: any) => (
            <div
              key={s.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b pb-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{s.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {s.students?.full_name ?? "Sem aluno"}
                </p>
              </div>
              <p className="shrink-0 text-sm text-muted-foreground">{dateTimeBR(s.scheduled_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
