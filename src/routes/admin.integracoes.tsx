import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl, dateBR } from "@/lib/format";
import { Copy, ExternalLink, CheckCircle2, AlertTriangle, Link2, Activity } from "lucide-react";

export const Route = createFileRoute("/admin/integracoes")({
  component: IntegracoesPage,
});

type Mapping = {
  id: string;
  title: string;
  external_id: string | null;
  kind: "mentorships" | "courses";
};

function IntegracoesPage() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/public/kiwify`);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: mappings = [] } = useQuery({
    queryKey: ["kiwify-mappings"],
    queryFn: async (): Promise<Mapping[]> => {
      const [m, c] = await Promise.all([
        supabase.from("mentorships").select("id, title, external_id").order("created_at"),
        supabase.from("courses").select("id, title, external_id").order("created_at"),
      ]);
      if (m.error) throw m.error;
      if (c.error) throw c.error;
      return [
        ...(m.data ?? []).map((r) => ({ ...r, kind: "mentorships" as const })),
        ...(c.data ?? []).map((r) => ({ ...r, kind: "courses" as const })),
      ];
    },
  });

  const saveMapping = useMutation({
    mutationFn: async ({ kind, id, external_id }: { kind: Mapping["kind"]; id: string; external_id: string }) => {
      const { error } = await supabase
        .from(kind)
        .update({ external_id: external_id.trim() || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mapeamento salvo.");
      void queryClient.invalidateQueries({ queryKey: ["kiwify-mappings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["kiwify-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kiwify_events")
        .select("id, order_id, order_status, customer_email, product_external_id, amount_cents, processed, message, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 30_000,
  });

  const unmapped = mappings.filter((m) => !m.external_id).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display">Integrações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte sua plataforma de vendas externa para automatizar acessos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant border-gold/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <img
                  src="https://kiwify.com.br/wp-content/uploads/2021/08/cropped-favicon-kiwify-1-32x32.png"
                  alt="Kiwify"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <CardTitle>Kiwify</CardTitle>
                <CardDescription>Automação de matrículas via Webhook</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  readOnly
                  className="bg-muted font-mono text-xs"
                />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copie esta URL e cole nas configurações de Webhook do seu produto na Kiwify.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Instruções:</h4>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                <li>Acesse seu painel Kiwify.</li>
                <li>Crie o produto (ex.: “Mentoria Destaque-se — Turma 1”) e publique.</li>
                <li>Em <strong>Apps</strong> {" > "} <strong>Webhooks</strong>, adicione a URL acima.</li>
                <li>
                  Marque os eventos: <strong>Compra aprovada</strong>, <strong>Reembolso</strong>,{" "}
                  <strong>Chargeback</strong> e <strong>Assinatura cancelada</strong>.
                </li>
                <li>
                  Copie o <strong>Token do Webhook</strong> e informe ao suporte para ser salvo com segurança
                  (chave <code>KIWIFY_WEBHOOK_SECRET</code>). Sem ele, os webhooks são rejeitados.
                </li>
                <li>Copie o <strong>Product ID</strong> de cada produto e cole no mapeamento ao lado.</li>
              </ul>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <a href="https://dashboard.kiwify.com.br/products" target="_blank" rel="noreferrer">
                Ir para Kiwify <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-gold/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-gold" />
              </div>
              <div>
                <CardTitle>Mapeamento de produtos</CardTitle>
                <CardDescription>
                  {unmapped > 0
                    ? `${unmapped} produto(s) sem ID da Kiwify`
                    : "Todos os produtos estão mapeados"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mappings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Cadastre mentorias ou cursos para mapear os produtos.
              </p>
            )}
            {mappings.map((m) => (
              <MappingRow key={`${m.kind}-${m.id}`} mapping={m} onSave={saveMapping.mutate} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-gold" />
            <div>
              <CardTitle>Últimos eventos recebidos</CardTitle>
              <CardDescription>Histórico das compras processadas pela Kiwify.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum evento recebido ainda. Faça uma compra teste na Kiwify para validar a conexão.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col gap-1 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {e.customer_email ?? "—"}{" "}
                      <span className="text-muted-foreground">· {e.order_status ?? "—"}</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{e.message}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm">{brl(e.amount_cents)}</span>
                    <span className="text-xs text-muted-foreground">{dateBR(e.created_at)}</span>
                    {e.processed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-gold" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MappingRow({
  mapping,
  onSave,
}: {
  mapping: Mapping;
  onSave: (v: { kind: Mapping["kind"]; id: string; external_id: string }) => void;
}) {
  const [value, setValue] = useState(mapping.external_id ?? "");

  useEffect(() => {
    setValue(mapping.external_id ?? "");
  }, [mapping.external_id]);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {mapping.title}
        <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          {mapping.kind === "mentorships" ? "Mentoria" : "Curso"}
        </span>
      </Label>
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder="Product ID da Kiwify"
          className="font-mono text-xs"
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={value === (mapping.external_id ?? "")}
          onClick={() => onSave({ kind: mapping.kind, id: mapping.id, external_id: value })}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
