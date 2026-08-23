import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoAsset from "@/assets/logo-horiz.png.asset.json";
import heroImg from "@/assets/hero-mentoria.jpg";

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
    if (busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bem-vinda de volta!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao entrar");
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor, informe seu e-mail para recuperar a senha.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação");
    } finally {
      setBusy(false);
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name },
        },
      });
      if (error) throw error;
      if (!data.session) toast.success("Conta criada! Confirme o e-mail para acessar.");
      else toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="surface-ink relative flex min-h-screen items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background decoration */}
      <img
        src={heroImg}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
      />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-gold/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-primary/20 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-ink p-10 rounded-[2.5rem] shadow-elegant ring-1 ring-white/10">
          <Link to="/" className="block text-center mb-10 group">
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              src={logoAsset.url}
              alt="Josi Nascimento — Massoterapia Avançada"
              className="mx-auto h-12 w-auto brightness-110 contrast-125"
            />
            <p className="mt-4 text-[9px] font-bold tracking-[0.5em] text-gold uppercase opacity-80 group-hover:opacity-100 transition-opacity">
              Plataforma de Mentorias
            </p>
          </Link>

          <Tabs defaultValue="entrar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-8">
              <TabsTrigger value="entrar" className="rounded-lg text-[10px] uppercase tracking-widest font-bold data-[state=active]:bg-gold data-[state=active]:text-ink">Entrar</TabsTrigger>
              <TabsTrigger value="criar" className="rounded-lg text-[10px] uppercase tracking-widest font-bold data-[state=active]:bg-gold data-[state=active]:text-ink">Cadastrar</TabsTrigger>
            </TabsList>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display text-white mb-2">Seja bem-vinda</h2>
              <p className="text-white/50 text-sm">
                Acesso exclusivo para mentoradas. Se você já é aluna, entre com seus dados abaixo.
              </p>
            </div>

            <TabsContent value="entrar" className="focus-visible:outline-none">
              <form onSubmit={signIn} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">E-mail</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-white/20 rounded-xl focus:ring-gold/30 transition-all"
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase">Senha</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] text-gold/60 hover:text-gold transition-colors font-semibold tracking-wider uppercase"
                      disabled={busy}
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 text-white rounded-xl focus:ring-gold/30 transition-all"
                  />
                </div>
                <Button type="submit" variant="gold" size="xl" className="w-full shadow-gold" disabled={busy}>
                  Entrar na Plataforma
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar" className="focus-visible:outline-none">
              <form onSubmit={signUp} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">Nome Completo</Label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-white/20 rounded-xl focus:ring-gold/30 transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">E-mail</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-white/20 rounded-xl focus:ring-gold/30 transition-all"
                    placeholder="exemplo@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">Senha</Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-white/10 bg-white/5 text-white rounded-xl focus:ring-gold/30 transition-all"
                  />
                </div>
                <Button type="submit" variant="gold" size="xl" className="w-full shadow-gold" disabled={busy}>
                  Criar Minha Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-10 text-center">
            <Link to="/" className="text-[10px] text-white/30 uppercase tracking-[0.2em] hover:text-white/60 transition-colors">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}