// o site está lento
// ela é massoterapeuta, tente deixar o site com tons mais brancos tb
// tire um pouco esses pontos pretos no backgound do site
// tire um pouco os pontos pretos no site
// tire os pontos pretos
import { createFileRoute, Link } from "@tanstack/react-router"; 
// estruture melhor o site, com efeitos, elementos profissionais, menu e estrutura profissional


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
import ebookImg from "@/assets/ebook-oficial.png.asset.json";
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

const pilaresDestaque = [
  { 
    n: "01", 
    title: "Excelência Técnica", 
    text: "Domine movimentos com precisão, fluidez e propósito. Aperfeiçoe sua prática através de cursos e experiências práticas.",
    icon: ShieldCheck
  },
  { 
    n: "02", 
    title: "Presença Profissional", 
    text: "Sua postura, comunicação e segurança comunicam seu nível profissional antes mesmo do primeiro toque.",
    icon: Crown
  },
  { 
    n: "03", 
    title: "Mentalidade Estratégica", 
    text: "Aprenda a transformar cada atendimento e desafio em oportunidade real de crescimento.",
    icon: Sparkles
  },
];

const pilaresApp = [
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
      {/* Texture & Noise */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.4] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <header className="glass-ink sticky top-0 z-[110] border-b border-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <img
              src={logoAsset.url}
              alt="Josi Nascimento"
              className="h-7 w-auto sm:h-9 hover:brightness-110 transition-all duration-500 drop-shadow-lux"
            />
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            {['O Método', 'A Mentora', 'Pilares', 'Conteúdo'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="hover:text-gold transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex shrink-0 items-center gap-4"
          >
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-[11px] font-bold tracking-widest text-white/70 hover:text-white hover:bg-white/5 uppercase">
              <Link to="/auth">Portal Aluna</Link>
            </Button>
            <Button asChild size="sm" variant="gold" className="shadow-gold h-9 px-6 text-[10px] font-bold tracking-widest uppercase">
              <Link to="/auth">Vagas Limitadas</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      <section id="hero" className="surface-ink relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex"
          >
            <div className="relative w-full h-full lg:w-[65%] ml-auto">
              <img
                src={josiNovoHero.url}
                alt="Josi Nascimento"
                className="h-full w-full object-cover object-[center_20%] lg:object-[center_top] mix-blend-luminosity filter brightness-110 contrast-125 saturate-[0.8]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent lg:hidden" />
              <div className="absolute inset-y-0 -left-1 w-[400px] bg-gradient-to-r from-ink via-ink/60 to-transparent hidden lg:block" />
            </div>
          </motion.div>
          
          {/* Light Rays / Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gold/10 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 pt-32 lg:pt-20 lg:pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-left max-w-3xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-6 py-2.5 mb-10 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Inscrições Abertas</span>
            </motion.div>

            <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl font-medium tracking-tight">
              <span className="block opacity-90">DOMINE A ARTE DA</span>
              <span className="text-gradient-gold block mt-3 drop-shadow-[0_10px_30px_rgba(212,175,55,0.4)] italic uppercase font-black">Massoterapia</span>
              <span className="block text-2xl sm:text-3xl mt-4 text-white/80 font-sans tracking-wide">DE ALTA PERFORMANCE</span>
            </h1>

            <p className="mt-8 max-w-xl text-base text-white/60 leading-relaxed sm:text-lg font-light">
              Eleve seu nível profissional através de um método exclusivo que une <span className="text-white font-medium italic underline decoration-gold/40 underline-offset-4">excelência técnica</span> e visão estratégica de mercado.
            </p>

            <div className="mt-12 flex flex-wrap justify-start gap-6 items-center">
              <Button asChild size="lg" variant="gold" className="h-14 px-10 text-[11px] font-bold tracking-widest uppercase shadow-gold group relative overflow-hidden">
                <Link to="/auth">
                  <span className="relative z-10 flex items-center">
                    Quero me destacar
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-white border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all">
                <Link to="/auth">Ver Módulos</Link>
              </Button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-16 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-ink bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-gold/40 to-primary/40" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">+2.5k Alunas</p>
                <p className="text-sm font-display text-gold italic">Comunidade de Elite</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-30 hidden lg:block"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      <section id="o-método" className="mx-auto max-w-6xl px-6 py-24 relative bg-white rounded-[3rem] my-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gold/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] -z-10" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
        
        <motion.div 
          {...fadeInUp}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gold/30" />
            <p className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">Ecossistema de Elite</p>
            <div className="h-[1px] w-12 bg-gold/30" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            A Experiência Completa
          </h2>
          <p className="mt-6 text-ink/50 max-w-xl mx-auto font-light text-base leading-relaxed">
            Uma plataforma desenhada para transformar sua jornada em um processo fluido, profissional e tecnológico.
          </p>
        </motion.div>

        <div className="relative overflow-hidden py-4">
          <motion.div 
            animate={isExperienceHovered ? {} : { x: ["0%", "-50%"] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            onMouseEnter={() => setIsExperienceHovered(true)}
            onMouseLeave={() => setIsExperienceHovered(false)}
            className="flex gap-8 w-fit"
          >
            {[...pilaresApp, ...pilaresApp].map((p, idx) => (
              <div
                key={`${p.title}-${idx}`}
                 className="group relative w-[320px] shrink-0 rounded-[2rem] border border-gold/10 bg-off-white/50 backdrop-blur-sm p-8 transition-all duration-700 hover:bg-white hover:shadow-2xl hover:-translate-y-3 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 bg-gold/5 blur-3xl rounded-full transition-all duration-1000 group-hover:scale-150 group-hover:bg-gold/15" />
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center transition-all duration-500 group-hover:bg-gold group-hover:shadow-gold-sm mb-8">
                    <p.icon className="h-7 w-7 text-gold transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-display mb-4 text-ink font-bold">{p.title}</h3>
                  <p className="text-[13px] text-ink/60 leading-relaxed font-light">{p.text}</p>
                </div>
                <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="h-5 w-5 text-gold/30" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="pilares" className="surface-ink py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold-soft)_0%,_transparent_100%)] opacity-5" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <span className="text-gold text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Fundamentos da Vitória</span>
            <h2 className="font-display text-4xl sm:text-6xl text-white font-medium tracking-tight">
              Os 3 Pilares do Sucesso
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mt-8 rounded-full opacity-50" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {pilaresDestaque.map((p, idx) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="group relative p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-gold/30 transition-all duration-700 hover:bg-white/[0.07]"
              >
                <div className="absolute -right-6 -top-6 text-9xl font-display font-black text-white/[0.03] group-hover:text-gold/[0.03] transition-colors">{p.n}</div>
                <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-10 border border-gold/20 relative">
                  <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p.icon className="h-8 w-8 text-gold relative z-10" />
                </div>
                <h3 className="text-2xl font-display text-white mb-5 italic font-medium">{p.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed font-light">{p.text}</p>
                
                <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <span className="text-[10px] font-bold text-gold tracking-widest uppercase flex items-center gap-2">
                    Ver detalhes <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentalidade de Campeão Section */}
      <section id="conteúdo" className="py-28 relative overflow-hidden bg-off-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="bg-ink rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] border border-gold/10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gold/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <motion.div {...fadeInUp}>
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gold/10 border border-gold/20 mb-10 backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase">Excelência Mental</span>
                </div>
                <h2 className="font-display text-4xl sm:text-6xl text-white font-medium mb-10 leading-[0.9] tracking-tight">
                  Protocolo da <span className="italic text-gradient-gold font-black">Vitória</span>
                </h2>
                <p className="text-white/60 text-base mb-12 leading-relaxed font-light max-w-lg">
                  O sucesso nos bastidores reflete na performance no palco. Dominar a mente é o primeiro passo para dominar a técnica.
                </p>
                
                <div className="space-y-8">
                  {[
                    { t: "Blindagem Profissional", d: "Construção de uma postura inabalável e segura." },
                    { t: "Performance de Elite", d: "Refinamento contínuo e busca pela perfeição." },
                    { t: "Foco Estratégico", d: "Clareza absoluta nos seus objetivos de carreira." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex gap-6 group"
                      whileHover={{ x: 10 }}
                    >
                      <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
                        <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-medium mb-2 group-hover:text-gold transition-colors">{item.t}</h4>
                        <p className="text-white/40 text-sm font-light leading-relaxed">{item.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Ebook Suspense Element */}
                <div className="relative group perspective-1000">
                  <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full opacity-50 animate-pulse" />
                    <div className="relative glass-ink rounded-[1.5rem] p-1 border border-white/10 shadow-2xl overflow-hidden transform group-hover:rotate-y-12 transition-transform duration-700">
                      <div className="aspect-[3/4] bg-gradient-to-br from-ink to-ink/90 relative overflow-hidden">
                        <img 
                          src={ebookImg.url} 
                          alt="Ebook Destaque-se na Massoterapia" 
                          className="absolute inset-0 w-full h-full object-contain p-4"
                        />
                        {/* Ebook Glow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                          <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Ebook Exclusivo</p>
                          <h4 className="text-white font-display text-lg italic italic">Destaque-se na Massoterapia</h4>
                        </div>
                      </div>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-ink py-20 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="text-gold text-xs font-semibold tracking-[0.4em] uppercase mb-4">Cronograma</p>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-medium tracking-tight">
              A jornada completa da mentoria
            </h2>
          </motion.div>

          <div className="relative overflow-hidden py-10">
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
                  className="group glass-ink w-[260px] shrink-0 rounded-[1.5rem] p-6 border border-white/5 hover:border-gold/30 transition-all"
                >
                  <p className="font-display text-4xl text-gradient-gold opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 origin-left italic leading-none">{m.n}</p>
                  <div className="mt-6 relative">
                    <div className="absolute -left-4 top-0 w-1 h-0 bg-gold/50 group-hover:h-full transition-all duration-700" />
                    <h4 className="text-lg font-display tracking-tight text-white mb-2 italic">{m.nome}</h4>
                    <p className="text-sm text-white/50 leading-relaxed font-light">{m.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="a-mentora" className="mx-auto max-w-6xl px-6 py-20 relative overflow-hidden">
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
              <div className="relative group overflow-hidden rounded-[1.5rem]">
                <img
                  src={josiSorriso.url}
                  alt="Josi Nascimento sorrindo"
                  className="aspect-[3/4] w-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.5rem]" />
              </div>
              <div className="relative group overflow-hidden rounded-[1.5rem]">
                <img
                  src={josiSobre.url}
                  alt="Josi Nascimento no consultório"
                  className="aspect-square w-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.5rem]" />
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
              <div className="relative group overflow-hidden rounded-[1.5rem]">
                <img
                  src={josiPremio.url}
                  alt="Josi Nascimento com prêmio"
                  className="aspect-[3/5] w-full object-cover shadow-2xl border-2 border-gold/30 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.5rem]" />
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

            <h2 className="font-display text-4xl sm:text-6xl mb-8 font-medium tracking-tighter leading-[0.85] relative">
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
                <p className="text-gold font-display text-2xl italic leading-none">+12</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Anos de Expert</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-gold font-display text-2xl italic leading-none">EXPERIÊNCIA</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">CONSOLIDADA</p>
              </div>
            </div>

            <div className="space-y-6 text-base text-white/70 leading-relaxed font-light">
              <p className="first-letter:text-4xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left">
                Massoterapeuta premiada e reconhecida internacionalmente, Josi transformou anos de
                prática clínica em um método claro e replicável, focado em resultados de alto padrão.
              </p>
              
              <div className="relative py-6 px-8 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                <Sparkles className="absolute top-4 right-4 h-6 w-6 text-gold/20 group-hover:text-gold/40 transition-colors" />
                <p className="italic text-white text-lg font-display leading-relaxed">
                  "Minha missão é elevar o padrão da massoterapia, transformando técnica em arte e profissionais em referências de mercado."
                </p>
              </div>

              <p>
                Nesta mentoria, ela conduz você passo a passo, da excelência técnica ao posicionamento 
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

      <section id="cta" className="mx-auto max-w-6xl px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3.5rem] bg-ink p-12 lg:p-24 text-center shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] border border-gold/20 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-primary/10 opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--gold-soft)_0%,_transparent_60%)] opacity-20" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-8"
            >
              Última Chamada do Ano
            </motion.div>
            <h2 className="font-display text-4xl sm:text-6xl text-white mb-8 font-medium tracking-tight leading-[1.1]">
              Pronta para <span className="italic text-gradient-gold font-black">Liderar</span> seu Mercado?
            </h2>
            <p className="text-white/50 text-base lg:text-lg mb-12 leading-relaxed font-light">
              Não perca a chance de ter o acompanhamento direto de quem já trilhou o caminho do sucesso internacional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" variant="gold" className="h-16 px-12 text-[12px] font-bold tracking-[0.2em] uppercase shadow-gold group w-full sm:w-auto relative overflow-hidden">
                <Link to="/auth" className="flex items-center gap-3">
                  <span className="relative z-10">Quero minha vaga</span>
                  <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-2" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-gold/60 text-[10px] font-bold tracking-[0.4em] uppercase">VAGAS EXTREMAMENTE LIMITADAS</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(i => (
                  <Sparkles key={i} className="h-3 w-3 text-gold/30" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-ink pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 mb-20 items-center">
            <div className="text-left">
              <img
                src={logoAsset.url}
                alt="Josi Nascimento"
                className="mb-10 h-10 w-auto brightness-110 drop-shadow-lux"
              />
              <p className="text-white/40 text-sm max-w-xs leading-relaxed font-light">
                Elevando o padrão da massoterapia avançada através de técnica, arte e estratégia.
              </p>
            </div>
            <div className="flex flex-wrap justify-start lg:justify-end gap-16">
              <div className="space-y-6">
                <h4 className="text-gold text-[10px] font-bold tracking-widest uppercase">Navegação</h4>
                <div className="flex flex-col gap-4 text-sm text-white/40 font-light">
                  <a href="#hero" className="hover:text-gold transition-colors">Início</a>
                  <a href="#o-método" className="hover:text-gold transition-colors">O Método</a>
                  <a href="#a-mentora" className="hover:text-gold transition-colors">A Mentora</a>
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-gold text-[10px] font-bold tracking-widest uppercase">Jurídico</h4>
                <div className="flex flex-col gap-4 text-sm text-white/40 font-light">
                  <a href="#" className="hover:text-gold transition-colors">Privacidade</a>
                  <a href="#" className="hover:text-gold transition-colors">Termos</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-bold">
              © {new Date().getFullYear()} JOSI NASCIMENTO
            </p>
            <div className="flex items-center gap-4">
               <span className="text-[10px] text-white/10 tracking-widest uppercase font-bold">Desenvolvido por</span>
               <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-black hover:brightness-125 transition-all">LIONLOBS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}