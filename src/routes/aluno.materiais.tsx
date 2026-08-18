import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/aluno/materiais")({
  component: StudentDownloads,
});

function StudentDownloads() {
  const { data = [] } = useQuery({
    queryKey: ["aluno-materiais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloads")
        .select("id, title, description, file_url")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">Downloads</h1>
      <p className="mt-1 text-sm text-muted-foreground">Materiais de apoio da mentoria.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum material disponível ainda.</p>
        )}
        {data.map((d) => (
          <a
            key={d.id}
            href={d.file_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-xl border bg-card p-5 shadow-elegant transition-colors hover:bg-accent"
          >
            <FileDown className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div className="min-w-0">
              <p className="truncate font-medium">{d.title}</p>
              {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
