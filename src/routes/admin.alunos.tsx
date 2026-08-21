import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { dateBR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/alunos")({
  component: () => {
    const handleInvite = async (row: any) => {
      if (!row.email) {
        toast.error("O aluno precisa ter um e-mail cadastrado.");
        return;
      }
      
      const { error } = await supabase.auth.admin.inviteUserByEmail(row.email);
      if (error) {
        toast.error("Erro ao enviar convite: " + error.message);
      } else {
        toast.success("Convite enviado com sucesso para " + row.email);
      }
    };

    return (
      <CrudPage
        table="students"
        title="Alunos"
        description="Cadastro completo das suas alunas e alunos. Apenas alunas cadastradas aqui terão acesso à plataforma."
        orderBy={{ column: "created_at" }}
        columns={[
          { key: "full_name", label: "Nome" },
          { key: "email", label: "E-mail" },
          { key: "phone", label: "Telefone" },
          { key: "status", label: "Situação" },
          { key: "created_at", label: "Cadastro", render: (r) => dateBR(r["created_at"]) },
        ]}
        fields={[
          { name: "full_name", label: "Nome completo", required: true },
          { name: "email", label: "E-mail" },
          { name: "phone", label: "Telefone" },
          {
            name: "status",
            label: "Situação",
            type: "select",
            defaultValue: "ativo",
            options: [
              { value: "ativo", label: "Ativo" },
              { value: "inativo", label: "Inativo" },
              { value: "lead", label: "Lead" },
            ],
          },
          { name: "notes", label: "Observações", type: "textarea" },
        ]}
      />
    );
  },
});
