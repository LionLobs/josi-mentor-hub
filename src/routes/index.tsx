import { createFileRoute, Link } from "@tanstack/react-router"; 
import { useState } from "react";
import {
  Sparkles,
  Crown,
  CalendarCheck,
  Wallet,
  GraduationCap,
  Download,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-mentoria.jpg";
import logoAsset from "@/assets/logo-horiz.png.asset.json";
import josiHero from "@/assets/josi-42.jpg.asset.json";
import josiSobre from "@/assets/josi-10.jpg.asset.json";
import josiPremio from "@/assets/josi-25.jpg.asset.json";
import josiSorriso from "@/assets/josi-6.jpg.asset.json";
import josiHeroBg from "@/assets/josi-17.jpg.asset.json";
import josiNovoHero from "@/assets/josi-25.jpg.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Josi Nascimento — Mentoria de Alto Impacto" },
      {
        name: "description",
        content:
          "Mentoria exclusiva de Josi Nascimento: método guiado, aulas gravadas, agenda online e acompanhamento individual para você brilhar com técnica e confiança.",
      },
      { property: "og:title", content: "Josi Nascimento — Mentoria de Alto Impacto" },
      {
        property: "og:description",
        content:
          "Método guiado, aulas gravadas, agenda online e acompanhamento individual. Menos dúvidas, mais técnica, mais confiança.",
      },
    ],
  }),
  component: Landing,
});

const pilares = [
  { icon: Crown, title: "Método guiado", text: "Módulos em sequência, do fundamento ao palco." },
  { icon: CalendarCheck, title: "Agenda online", text: "Sessões individuais marcadas em segundos." },
  { icon: GraduationCap, title: "Área do aluno", text: "Aulas, materiais e evolução em um só lugar." },
  { icon: Wallet, title: "Financeiro claro", text: "Pagamentos, parcelas e recibos organizados." },
  { icon: Download, title: "Downloads", text: "Apostilas, checklists e bônus liberados." },
  { icon: ShieldCheck, title: "Acesso seguro", text: "Cada aluna vê apenas o conteúdo dela." },
];

const modulos = [
  { n: "01", nome: "PRESENÇA", desc: "Postura, respiração e domínio do próprio corpo." },
  { n: "02", nome: "ATITUDE", desc: "Marcação, ritmo e expressão em cada passo." },
  { n: "03", nome: "CONEXÃO", desc: "Olhar, storytelling e presença de palco." },
  { n: "04", nome: "TRIUNFO", desc: "Poses, finalização e performance completa." },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

function Landing() {
  const [isExperienceHovered, setIsExperienceHovered] = useState(false);
  const [isJourneyHovered, setIsJourneyHovered] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-white overflow-x-hidden selection:bg-gold selection:text-ink relative">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <header className="glass-ink sticky top-0 z-50 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <img
              src={logoAsset.url}
              alt="Josi Nascimento — Massoterapia Avançada"
              className="h-8 w-auto sm:h-10"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex shrink-0 items-center gap-4"
          >
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-white hover:bg-white/10">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" variant="gold" className="shadow-gold">
              <Link to="/auth">Quero entrar</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      <section className="surface-ink relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0 flex"
          >
            <div className="relative w-full h-full lg:w-1/2 ml-auto">
              <img
                src={josiNovoHero.url}
                alt="Josi Nascimento — Massoterapia Avançada"
                className="h-full w-full object-cover object-[90%_center] lg:object-center brightness-110 contrast-125 translate-x-32 lg:translate-x-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-transparent lg:hidden" />
              <div className="absolute inset-y-0 -left-1 w-32 bg-gradient-to-r from-ink to-transparent hidden lg:block" />
            </div>
          </motion.div>
          
          {/* Enhanced Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--gold)_0%,_transparent_70%)] opacity-20" />
          
          {/* Animated Glows */}
          <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] bg-gold/15 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] bg-gold/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Grain Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-20 flex justify-start items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hairline-gold mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-[10px] font-medium tracking-[0.3em] text-gold uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" /> Mentoria Exclusiva
            </motion.div>
            <h1 className="font-display text-4xl leading-[1.1] sm:text-6xl lg:text-7xl font-medium tracking-tight">
              Elevando a sua{" "}
              <span className="text-gradient-gold block mt-2 drop-shadow-[0_4px_20px_rgba(212,175,55,0.3)] italic">Arte do Toque</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/70 leading-relaxed sm:text-lg">
              Transforme sua carreira com o método de <span className="text-white font-medium">Massoterapia Avançada</span>. 
              Domine técnicas exclusivas e conquiste o posicionamento que você merece.
            </p>
            <div className="mt-10 flex flex-wrap justify-start gap-5">
              <Button asChild size="xl" variant="gold" className="h-14 px-10 text-base shadow-gold group">
                <Link to="/auth">
                  Começar minha mentoria 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="h-14 px-10 text-base border-white/40 bg-white text-ink hover:bg-white/90 backdrop-blur-sm shadow-lux">
                <Link to="/auth">Conhecer meu método</Link>
              </Button>
            </div>
            
            {/* Certificação Badge - repositioned since portrait is gone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12 flex items-center gap-4 justify-start"
            >
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gold font-medium uppercase tracking-wider">Certificação</p>
                <p className="text-lg font-display text-white italic">Internacional Mar del Plata</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 relative bg-white rounded-[3rem] my-12 shadow-elegant border border-gold/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold/5 blur-[120px] rounded-full" />
        
        <motion.div 
          {...fadeInUp}
          className="text-center mb-20"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">Experiência</p>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            Tudo o que você recebe por dentro
          </h2>
        </motion.div>

        <div className="relative overflow-hidden py-10">
          {/* Removed gradients for cleaner look */}

          
          <motion.div 
            animate={isExperienceHovered ? {} : { x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            onMouseEnter={() => setIsExperienceHovered(true)}
            onMouseLeave={() => setIsExperienceHovered(false)}
            className="flex gap-6 w-fit"
          >
            {[...pilares, ...pilares].map((p, idx) => (
              <div
                key={`${p.title}-${idx}`}
                 className="group relative w-[350px] shrink-0 rounded-[2rem] border border-gold/10 bg-off-white/80 backdrop-blur-md p-8 transition-all duration-500 hover:bg-white hover:shadow-gold hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-gold/10 blur-3xl rounded-full transition-all duration-700 group-hover:scale-150 group-hover:bg-gold/20" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center transition-colors group-hover:bg-gold/10 mb-6">
                    <p.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-2xl font-display mb-4 text-ink">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-ink/70">{p.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="surface-ink py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-soft)_0%,_transparent_100%)] opacity-5" />
        
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">Cronograma</p>
            <h2 className="font-display text-3xl sm:text-5xl text-white font-medium tracking-tight">
              A jornada completa da mentoria
            </h2>
          </motion.div>

          <div className="relative overflow-hidden py-10">
            {/* Removed gradients for cleaner look */}


            <motion.div 
              animate={isJourneyHovered ? {} : { x: ["0%", "-50%"] }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              onMouseEnter={() => setIsJourneyHovered(true)}
              onMouseLeave={() => setIsJourneyHovered(false)}
              className="flex gap-6 w-fit"
            >
              {[...modulos, ...modulos].map((m, idx) => (
                <div 
                  key={`${m.n}-${idx}`}
                  className="group glass-ink w-[300px] shrink-0 rounded-[2rem] p-8 border border-white/5 hover:border-gold/30 transition-all"
                >
                  <p className="font-display text-5xl text-gradient-gold opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 origin-left italic leading-none">{m.n}</p>
                  <div className="mt-6 relative">
                    <div className="absolute -left-4 top-0 w-1 h-0 bg-gold/50 group-hover:h-full transition-all duration-700" />
                    <h4 className="text-xl font-display tracking-tight text-white mb-2 italic">{m.nome}</h4>
                    <p className="text-base text-white/50 leading-relaxed font-light">{m.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--gold-soft)_0%,_transparent_70%)] opacity-[0.05] -z-10" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[15rem] font-display font-black text-gold/5 pointer-events-none select-none rotate-90 lg:rotate-0 lg:opacity-10">
          METHOD
        </div>
        
        
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4 sm:gap-8"
          >
            <div className="space-y-4 sm:space-y-8">
              <div className="relative group overflow-hidden rounded-[2rem]">
                <img
                  src={josiSorriso.url}
                  alt="Josi Nascimento sorrindo"
                  className="aspect-[3/4] w-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem]" />
              </div>
              <div className="relative group overflow-hidden rounded-[2rem]">
                <img
                  src={josiSobre.url}
                  alt="Josi Nascimento no consultório"
                  className="aspect-square w-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem]" />
              </div>
            </div>
            <div className="pt-16 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -right-8 z-20 hidden sm:block"
              >
                <div className="relative flex items-center justify-center w-24 h-24">
                  <div className="absolute inset-0 rounded-full border border-gold/30 border-dashed" />
                  <p className="text-[8px] text-gold font-bold uppercase tracking-[0.2em] text-center px-2">
                    Premium • Excellence • Advanced
                  </p>
                </div>
              </motion.div>
              <div className="relative group overflow-hidden rounded-[2rem]">
                <img
                  src={josiPremio.url}
                  alt="Josi Nascimento com prêmio"
                  className="aspect-[3/5] w-full object-cover shadow-2xl border-2 border-gold/30 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem]" />
                <div className="absolute bottom-6 left-6 right-6 glass-ink p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                   <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold">Certificação Internacional</p>
                   <p className="text-sm text-white italic">Mar del Plata</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-gold/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <p className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">A Mentora</p>
              </div>
              <div className="h-px w-12 bg-gold/30" />
            </div>

            <h2 className="font-display text-5xl sm:text-7xl mb-10 font-medium tracking-tighter leading-[0.85] relative">
              Josi <br />
              <span className="text-gradient-gold italic">Nascimento</span>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                className="h-1 bg-gold/30 absolute -bottom-4 left-0"
              />
            </h2>

            <div className="flex gap-8 mb-10">
              <div>
                <p className="text-gold font-display text-3xl italic leading-none">12+</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Anos de Expert</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-gold font-display text-3xl italic leading-none">2.5k</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Alunas Formadas</p>
              </div>
            </div>

            <div className="space-y-8 text-lg text-white/70 leading-relaxed font-light">
              <p className="first-letter:text-4xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                Massoterapeuta premiada e reconhecida internacionalmente, Josi transformou anos de
                prática clínica em um método claro e replicável, focado em resultados de alto padrão.
              </p>
              
              <div className="relative py-8 px-10 rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                <Sparkles className="absolute top-4 right-4 h-6 w-6 text-gold/20 group-hover:text-gold/40 transition-colors" />
                <p className="italic text-white text-xl font-display leading-relaxed">
                  "Minha missão é elevar o padrão da massoterapia, transformando técnica em arte e profissionais em referências de mercado."
                </p>
              </div>

              <p>
                Nesta mentoria, ela conduz você passo a passo — da excelência técnica ao posicionamento 
                de mercado que atrai clientes de alto valor, garantindo sua independência financeira.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="font-display text-2xl italic tracking-tighter text-gold drop-shadow-gold">Josi Nascimento</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white relative overflow-hidden rounded-[3rem] p-10 sm:p-16 text-center shadow-gold border border-gold/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--gold-soft)_0%,_transparent_50%)] opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl text-ink mb-6 font-medium tracking-tight">Sua vaga na próxima turma</h2>
            <p className="text-ink/60 text-lg mb-10 leading-relaxed">
              Tenha acesso imediato à plataforma exclusiva, cronograma de sessões individuais 
              e toda a biblioteca de conhecimentos do método.
            </p>
            <Button asChild size="xl" variant="gold" className="h-16 px-12 text-lg shadow-gold group">
              <Link to="/auth" className="flex items-center gap-3">
                Garantir meu acesso agora
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="mt-8 text-ink/40 text-sm tracking-widest uppercase">Vagas limitadas por turma</p>
          </div>
        </motion.div>
      </section>

      <footer className="surface-ink py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <img
            src={logoAsset.url}
            alt="Josi Nascimento — Massoterapia Avançada"
            className="mx-auto mb-8 h-12 w-auto opacity-80"
          />
          <div className="flex justify-center gap-8 mb-8 text-white/40 text-sm">
            <a href="#" className="hover:text-gold transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-gold transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gold transition-colors">Suporte</a>
          </div>
          <p className="text-white/30 text-xs tracking-widest">
            © {new Date().getFullYear()} JOSI NASCIMENTO · DESIGNED FOR EXCELLENCE
          </p>
        </div>
      </footer>
    </div>
  );
}