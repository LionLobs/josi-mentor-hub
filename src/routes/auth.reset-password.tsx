import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/logo-horiz.png";
import heroImg from "@/assets/hero-mentoria.jpg";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir Senha — Plataforma Josi Nascimento" },
      {
        name: "description",
        content: "Redefina sua senha de acesso à plataforma.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha redefinida com sucesso!");
      void navigate({ to: "/auth" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao redefinir senha");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="surface-ink relative flex min-h-screen items-center justify-center px-6 py-12 overflow-hidden">
      <img
        src={heroImg}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
      />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-gold/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-ink p-10 rounded-[2.5rem] shadow-elegant ring-1 ring-white/10">
          <div className="text-center mb-10">
            <img
              src={logoAsset}
              alt="Logo"
              className="mx-auto h-12 w-auto brightness-110"
            />
            <h2 className="text-2xl font-display text-white mt-8 mb-2">Redefinir Senha</h2>
            <p className="text-white/50 text-sm">
              Digite sua nova senha abaixo.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">Nova Senha</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-white/10 bg-white/5 text-white rounded-xl focus:ring-gold/30 transition-all"
                placeholder="No mínimo 6 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-xs font-semibold tracking-wider uppercase ml-1">Confirmar Senha</Label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-white/10 bg-white/5 text-white rounded-xl focus:ring-gold/30 transition-all"
              />
            </div>
            <Button type="submit" variant="gold" size="xl" className="w-full shadow-gold" disabled={busy}>
              Atualizar Senha
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
