import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileDown, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/lib/storage";
import { motion } from "framer-motion";

// Mock poster for downloads to keep the Netflix vibe
import josiPoster from "@/assets/josi_nascimento_40_anos-14.jpg.asset.json";

export const Route = createFileRoute("/aluno/materiais")({
  component: StudentDownloads,
});

function StudentDownloads() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["aluno-materiais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("id, title, description, file_url, storage_path, courses(title)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const open = async (d: any) => {
    const url = d.storage_path ? await getSignedUrl(d.storage_path) : d.file_url;
    if (!url) {
      toast.error("Arquivo indisponível");
      return;
    }
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-2">Biblioteca Digital</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white">Materiais & <span className="text-gold italic">Recursos</span></h1>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Buscar material..." 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold transition-all w-full md:w-64"
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-gold transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!isLoading && data.length === 0 && (
          <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/10">
            <FileDown className="h-12 w-12 text-gold/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Nenhum material de apoio disponível ainda.</p>
          </div>
        )}
        
        {data.map((d: any, idx: number) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card shadow-elegant"
          >
            <div className="absolute inset-0 z-0">
               <img src={josiPoster.url} className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
            </div>
            
            <div className="relative z-10 p-8 flex flex-col h-full">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold group-hover:bg-gold group-hover:text-black transition-colors duration-500">
                <FileDown className="h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition-colors">{d.title}</h3>
                {d.description && (
                  <p className="text-sm text-white/60 line-clamp-2 mb-4">{d.description}</p>
                )}
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                  {d.courses?.title ?? "Material Exclusivo"}
                </span>
              </div>
              
              <button
                onClick={() => void open(d)}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Download Agora
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended for you horizontal list (Mock) */}
      <section className="mt-20">
        <h2 className="text-2xl font-serif text-white mb-8 px-1">Materiais <span className="text-gold italic">Premium</span></h2>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[280px] h-40 rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="h-8 w-8 rounded-lg bg-gold/20 flex items-center justify-center">
                   <FileDown className="h-4 w-4 text-gold" />
                </div>
                <span className="text-[9px] font-bold text-gold uppercase border border-gold/30 px-2 py-0.5 rounded-full">PDF</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Protocolo Master #{i}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Material de Apoio</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
