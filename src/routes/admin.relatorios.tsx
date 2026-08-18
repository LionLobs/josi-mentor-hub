import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/relatorios")({
  component: Reports,
});

function monthKey(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function Reports() {
  const { data } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const [payments, students, sessions] = await Promise.all([
        supabase.from("payments").select("amount_cents, status, paid_at, created_at"),
        supabase.from("students").select("status"),
        supabase.from("sessions").select("status"),
      ]);
      return {
        payments: payments.data ?? [],
        students: students.data ?? [],
        sessions: sessions.data ?? [],
      };
    },
  });

  const payments = data?.payments ?? [];
  const byMonth = new Map<string, number>();
  payments
    .filter((p) => p.status === "pago" && p.paid_at)
    .forEach((p) => {
      const k = monthKey(p.paid_at as string);
      byMonth.set(k, (byMonth.get(k) ?? 0) + (p.amount_cents ?? 0));
    });
  const months = [...byMonth.entries()];
  const max = Math.max(1, ...months.map(([, v]) => v));

  const statusCount = (rows: { status: string }[]) =>
    rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Relatórios</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Faturamento, alunos e sessões consolidados.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-elegant">
        <h2 className="text-xl">Faturamento por mês</h2>
        <div className="mt-5 space-y-3">
          {months.length === 0 && (
            <p className="text-sm text-muted-foreground">Ainda não há pagamentos registrados.</p>
          )}
          {months.map(([month, total]) => (
            <div key={month} className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-sm text-muted-foreground">{month}</span>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-[image:var(--gradient-gold)]"
                  style={{ width: `${(total / max) * 100}%` }}
                />
              </div>
              <span className="shrink-0 text-sm font-medium">{brl(total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-xl">Alunos por situação</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(statusCount(data?.students ?? [])).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b pb-2 last:border-0">
                <span className="capitalize text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <h2 className="text-xl">Sessões por situação</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(statusCount(data?.sessions ?? [])).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b pb-2 last:border-0">
                <span className="capitalize text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
