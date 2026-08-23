import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";

export const Route = createFileRoute("/admin/materiais")({
  component: () => (
    <CrudPage
      table="downloads"
      title="Área de downloads"
      description="Envie PDFs, apostilas e materiais complementares para as alunas."
      select="*, courses(title)"
      orderBy={{ column: "created_at" }}
      columns={[
        { key: "title", label: "Material" },
        { key: "course", label: "Curso", render: (r) => r["courses"]?.title ?? "Geral" },
        {
          key: "origem",
          label: "Origem",
          render: (r) => (r["storage_path"] ? "Upload" : r["file_url"] ? "Link externo" : "—"),
        },
        { key: "published", label: "Publicado", render: (r) => (r["published"] ? "Sim" : "Não") },
      ]}
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        {
          name: "storage_path",
          label: "Arquivo (upload)",
          type: "file",
          folder: "materiais",
          accept: ".pdf,.doc,.docx,.ppt,.pptx,.zip,image/*",
          hint: "PDF, documentos, imagens ou ZIP.",
        },
        { name: "file_url", label: "Ou link externo do arquivo" },
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
