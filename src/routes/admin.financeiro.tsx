import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { brl, dateBR } from "@/lib/format";

export const Route = createFileRoute("/admin/financeiro")({
  component: () => (
    <CrudPage
      table="payments"
      title="Financeiro"
      description="Controle de pagamentos e recebimentos."
      select="*, students(full_name)"
      orderBy={{ column: "created_at" }}
      columns={[
        { key: "description", label: "Descrição" },
        { key: "student", label: "Aluno", render: (r) => r["students"]?.full_name ?? "—" },
        { key: "amount_cents", label: "Valor", render: (r) => brl(r["amount_cents"]) },
        { key: "due_date", label: "Vencimento", render: (r) => dateBR(r["due_date"]) },
        { key: "status", label: "Situação" },
        { key: "method", label: "Forma" },
      ]}
      fields={[
        { name: "description", label: "Descrição", required: true },
        {
          name: "student_id",
          label: "Aluno",
          type: "select",
          optionsFrom: { table: "students", labelKey: "full_name" },
        },
        { name: "amount_cents", label: "Valor (R$)", type: "money", required: true },
        { name: "due_date", label: "Vencimento", type: "date" },
        {
          name: "method",
          label: "Forma de pagamento",
          type: "select",
          options: [
            { value: "pix", label: "PIX" },
            { value: "cartao", label: "Cartão" },
            { value: "boleto", label: "Boleto" },
            { value: "transferencia", label: "Transferência" },
          ],
        },
        {
          name: "status",
          label: "Situação",
          type: "select",
          defaultValue: "pendente",
          options: [
            { value: "pendente", label: "Pendente" },
            { value: "pago", label: "Pago" },
            { value: "atrasado", label: "Atrasado" },
            { value: "cancelado", label: "Cancelado" },
          ],
        },
        { name: "paid_at", label: "Pago em", type: "datetime" },
      ]}
    />
  ),
});
