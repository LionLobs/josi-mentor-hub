import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/integracoes")({
  component: IntegracoesPage,
});

function IntegracoesPage() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `${window.location.origin}/api/public/kiwify`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

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
                <li>Vá em <strong>Produtos</strong> e selecione sua mentoria.</li>
                <li>Clique em <strong>Configurações</strong> > <strong>Webhooks</strong>.</li>
                <li>Adicione uma nova URL e cole o link acima.</li>
                <li>Selecione o evento <strong>Compra Aprovada</strong>.</li>
              </ul>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
              <a href="https://dashboard.kiwify.com.br/products" target="_blank" rel="noreferrer">
                Ir para Kiwify <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60 grayscale cursor-not-allowed">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold">
                H
              </div>
              <div>
                <CardTitle>Hotmart</CardTitle>
                <CardDescription>Em breve</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integração com Hotmart está sendo preparada para sua plataforma.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
