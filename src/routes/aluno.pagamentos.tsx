import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, dateBR } from "@/lib/format";
import { Wallet, ShieldCheck, CreditCard, ReceiptText, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/aluno/pagamentos")({
  component: StudentPayments,
});

function StudentPayments() {
  const { data = [], isLoading } = useQuery({
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

  const totalPaid = data
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount_cents || 0), 0);

  const pending = data.filter(p => p.status === 'pending' || p.status === 'overdue');

  return (
    <div className="pb-20">
      <div className="mb-12">
        <p className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-2">Área Financeira</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white">Gestão de <span className="text-gold italic">Investimento</span></h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-4 mb-12">
        <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between h-48">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Total Investido</p>
          <div>
            <h3 className="text-3xl font-serif text-white mb-1">{brl(totalPaid)}</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Investimento Ativo</p>
          </div>
        </div>
        
        <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between h-48">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Pendências</p>
          <div>
            <h3 className="text-3xl font-serif text-white mb-1">{pending.length}</h3>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Parcelas em aberto</p>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl bg-gold p-8 flex items-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-32 w-32 text-black" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 w-full">
              <div className="h-16 w-16 rounded-2xl bg-black/10 flex items-center justify-center shrink-0">
                 <CreditCard className="h-8 w-8 text-black" />
              </div>
              <div className="flex-1">
                 <h4 className="text-xl font-serif text-black mb-2">Precisa de ajuda com o pagamento?</h4>
                 <p className="text-black/60 text-sm">Fale diretamente com o financeiro para alteração de cartão ou datas.</p>
              </div>
              <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shrink-0">
                 Suporte Financeiro
              </button>
           </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-8 px-1">
           <ReceiptText className="h-6 w-6 text-gold" />
           <h2 className="text-2xl font-serif text-white">Histórico de <span className="text-gold">Faturas</span></h2>
        </div>

        {isLoading && (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="py-20 text-center rounded-3xl border border-dashed border-white/10">
             <Wallet className="h-12 w-12 text-white/10 mx-auto mb-4" />
             <p className="text-sm text-muted-foreground">Nenhum registro financeiro encontrado.</p>
          </div>
        )}

        <div className="space-y-4">
          {data.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl border border-white/10 bg-card hover:bg-white/5 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-gold transition-colors shrink-0">
                 <ReceiptText className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-white truncate">{p.description ?? "Investimento Mentoria"}</h4>
                  {p.status === 'paid' ? (
                    <span className="text-[9px] font-bold text-emerald-500 uppercase border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/5">Pago</span>
                  ) : (
                    <span className="text-[9px] font-bold text-gold uppercase border border-gold/20 px-2 py-0.5 rounded-full bg-gold/5">Pendente</span>
                  )}
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                   Vencimento: {dateBR(p.due_date)} 
                   {p.method && <><span className="h-1 w-1 rounded-full bg-white/20" /> {p.method}</>}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                 <p className="text-2xl font-serif text-white">{brl(p.amount_cents)}</p>
                 <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mt-20 p-12 rounded-[40px] border border-white/5 bg-white/2 text-center max-w-3xl mx-auto">
         <ShieldCheck className="h-12 w-12 text-gold/40 mx-auto mb-6" />
         <h3 className="text-2xl font-serif text-white mb-4">Ambiente 100% Seguro</h3>
         <p className="text-white/40 text-sm leading-relaxed mb-0">
           Toda a sua jornada financeira é protegida por criptografia de ponta a ponta. 
           Os pagamentos são processados via Kiwify e integrados automaticamente à sua conta.
         </p>
      </div>
    </div>
  );
}
