import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoAsset from "@/assets/logo-horiz.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Plataforma Josi Nascimento" },
      {
        name: "description",
        content: "Acesse a plataforma de mentorias da Josi Nascimento: área do aluno e painel administrativo.",
      },
      { property: "og:title", content: "Entrar — Plataforma Josi Nascimento" },
      {
        property: "og:description",
        content: "Acesse sua conta na plataforma de mentorias da Josi Nascimento.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: isAdmin ? "/admin" : "/aluno" });
    }
  }, [user, isAdmin, loading, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Bem-vinda de volta!");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) toast.success("Conta criada! Confirme o e-mail para acessar.");
    else toast.success("Conta criada com sucesso!");
  };

  return (
    <div className="surface-ink flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <Link to="/" className="block text-center">
          <img
            src={logoAsset.url}
            alt="Josi Nascimento — Massoterapia Avançada"
            className="mx-auto h-10 w-auto"
          />
          <p className="text-[11px] tracking-[0.3em] text-gold-soft/80">PLATAFORMA DE MENTORIAS</p>
        </Link>

        <Tabs defaultValue="entrar" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="entrar">Entrar</TabsTrigger>
            <TabsTrigger value="criar">Criar conta</TabsTrigger>
          </TabsList>

          <TabsContent value="entrar">
            <form onSubmit={signIn} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">E-mail</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/15 bg-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Senha</Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/15 bg-white/10 text-white"
                />
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={busy}>
                Entrar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="criar">
            <form onSubmit={signUp} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Nome completo</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/15 bg-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">E-mail</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/15 bg-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Senha</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/15 bg-white/10 text-white"
                />
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={busy}>
                Criar conta
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
