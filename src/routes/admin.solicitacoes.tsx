import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/admin/solicitacoes")({
  component: SolicitacoesPage,
});

function SolicitacoesPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["registration_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("registration_requests" as any)
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration_requests"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  if (isLoading) return <div className="p-8 text-center text-white/50">Carregando solicitações...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-white font-medium tracking-tight">Solicitações de Acesso</h1>
          <p className="text-white/50 mt-2 text-sm">Gerencie novos cadastros e leads interessados na mentoria.</p>
        </div>
        <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5 px-4 py-1">
          {requests?.length || 0} Total
        </Badge>
      </div>

      <div className="glass-ink rounded-[2rem] border border-white/5 overflow-hidden shadow-elegant">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold py-6">Nome</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">E-mail</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Data</TableHead>
              <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Status</TableHead>
              <TableHead className="text-right text-white/40 uppercase tracking-widest text-[10px] font-bold pr-8">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((req) => (
              <TableRow key={req.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                <TableCell className="font-medium text-white py-6">{req.full_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-white/60">
                    <Mail className="h-3 w-3 text-gold/50" />
                    {req.email}
                  </div>
                </TableCell>
                <TableCell className="text-white/40 text-xs">
                  {format(new Date(req.created_at), "dd MMM, yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      req.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                      'bg-gold/10 text-gold border-gold/20'
                    }
                  >
                    {req.status === 'approved' ? 'Aprovado' :
                     req.status === 'rejected' ? 'Recusado' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    {req.status === 'pending' && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full text-emerald-500 hover:bg-emerald-500/10 transition-all"
                          onClick={() => updateStatus.mutate({ id: req.id, status: 'approved' })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10 transition-all"
                          onClick={() => updateStatus.mutate({ id: req.id, status: 'rejected' })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {req.status !== 'pending' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-white/20 hover:text-gold hover:bg-white/5 transition-all"
                        onClick={() => updateStatus.mutate({ id: req.id, status: 'pending' })}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {requests?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-white/20 italic">
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
