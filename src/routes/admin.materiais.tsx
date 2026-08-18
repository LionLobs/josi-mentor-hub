import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";

export const Route = createFileRoute("/admin/materiais")({
  component: () => (
    <CrudPage
      table="downloads"
      title="Área de downloads"
      description="Materiais complementares disponíveis para as alunas."
      select="*, courses(title)"
      orderBy={{ column: "created_at" }}
      columns={[
        { key: "title", label: "Material" },
        { key: "course", label: "Curso", render: (r) => r["courses"]?.title ?? "Geral" },
        { key: "published", label: "Publicado", render: (r) => (r["published"] ? "Sim" : "Não") },
      ]}
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "file_url", label: "URL do arquivo", required: true },
        {
          name: "course_id",
          label: "Curso (opcional)",
          type: "select",
          optionsFrom: { table: "courses", labelKey: "title" },
        },
        { name: "published", label: "Publicado", type: "checkbox", defaultValue: true },
      ]}
    />
  ),
});
