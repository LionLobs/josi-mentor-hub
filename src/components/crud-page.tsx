import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Row = Record<string, any>;

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "money" | "date" | "datetime" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  optionsFrom?: { table: string; labelKey: string };
  required?: boolean;
  defaultValue?: any;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Row) => ReactNode;
};

type Props = {
  table: string;
  title: string;
  description?: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: Column[];
  fields: Field[];
};

function toInput(field: Field, value: any) {
  if (value === null || value === undefined) return "";
  if (field.type === "money") return String(Number(value) / 100);
  if (field.type === "datetime") return new Date(value).toISOString().slice(0, 16);
  return String(value);
}

function fromInput(field: Field, raw: any) {
  if (field.type === "checkbox") return Boolean(raw);
  if (raw === "" || raw === undefined) return null;
  if (field.type === "money") return Math.round(Number(raw) * 100);
  if (field.type === "number") return Number(raw);
  if (field.type === "datetime") return new Date(raw).toISOString();
  return raw;
}

export function CrudPage({
  table,
  title,
  description,
  select = "*",
  orderBy,
  columns,
  fields,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [table, select, orderBy],
    queryFn: async () => {
      let q = supabase.from(table as any).select(select);
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const relationFields = fields.filter((f) => f.optionsFrom);
  const { data: relations = {} } = useQuery({
    queryKey: ["relations", relationFields.map((f) => f.optionsFrom?.table).join(",")],
    enabled: relationFields.length > 0,
    queryFn: async () => {
      const result: Record<string, { value: string; label: string }[]> = {};
      for (const f of relationFields) {
        const { data } = await supabase
          .from(f.optionsFrom!.table as any)
          .select(`id, ${f.optionsFrom!.labelKey}`);
        result[f.name] = ((data ?? []) as Row[]).map((r) => ({
          value: r.id,
          label: r[f.optionsFrom!.labelKey] ?? "—",
        }));
      }
      return result;
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Row) => {
      if (editing) {
        const { error } = await supabase
          .from(table as any)
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Registro atualizado" : "Registro criado");
      setOpen(false);
      setEditing(null);
      setForm({});
      void qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registro excluído");
      void qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openNew = () => {
    setEditing(null);
    const initial: Row = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) initial[f.name] = f.defaultValue;
    });
    setForm(initial);
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    const initial: Row = {};
    fields.forEach((f) => {
      initial[f.name] = f.type === "checkbox" ? Boolean(row[f.name]) : toInput(f, row[f.name]);
    });
    setForm(initial);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Row = {};
    fields.forEach((f) => {
      payload[f.name] = fromInput(f, form[f.name]);
    });
    save.mutate(payload);
  };

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" className="shrink-0" onClick={openNew}>
              <Plus className="h-4 w-4" /> Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Novo"} registro</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              {fields.map((f) => {
                const options = f.options ?? relations[f.name] ?? [];
                return (
                  <div key={f.name} className="space-y-2">
                    <Label>{f.label}</Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        value={form[f.name] ?? ""}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      />
                    ) : f.type === "select" ? (
                      <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={form[f.name] ?? ""}
                        required={f.required}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      >
                        <option value="">Selecione…</option>
                        {options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[oklch(0.34_0.062_163)]"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                      />
                    ) : (
                      <Input
                        type={
                          f.type === "money" || f.type === "number"
                            ? "number"
                            : f.type === "date"
                              ? "date"
                              : f.type === "datetime"
                                ? "datetime-local"
                                : "text"
                        }
                        step={f.type === "money" ? "0.01" : undefined}
                        required={f.required}
                        value={form[f.name] ?? ""}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      />
                    )}
                  </div>
                );
              })}
              <DialogFooter>
                <Button type="submit" variant="gold" disabled={save.isPending}>
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card shadow-elegant">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>Carregando…</TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                  Nenhum registro ainda.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(row) : (row[c.key] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove.mutate(row.id)}
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
