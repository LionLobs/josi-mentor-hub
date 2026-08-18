import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, dateBR } from "@/lib/format";

export const Route = createFileRoute("/aluno/pagamentos")({
  component: StudentPayments,
});

function StudentPayments() {
  const { data = [] } = useQuery({
    queryKey: ["aluno-pagamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, description, amount_cents, due_date, status, method, paid_at")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Pagamentos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Histórico e parcelas em aberto.</p>

      <div className="mt-6 space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
        )}
        {data.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-5 shadow-elegant"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{p.description ?? "Pagamento"}</p>
              <p className="text-sm text-muted-foreground">
                Vencimento {dateBR(p.due_date)} · {p.status}
              </p>
            </div>
            <p className="font-display shrink-0 text-lg">{brl(p.amount_cents)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
