import { useRef, useState } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadContentFile } from "@/lib/storage";

type Props = {
  value?: string | null;
  onChange: (path: string | null) => void;
  folder: string;
  accept?: string;
  hint?: string;
};

export function FileUpload({ value, onChange, folder, accept, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadContentFile(file, folder);
      onChange(path);
      toast.success("Arquivo enviado");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => void handle(e.target.files?.[0])}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          {value ? "Substituir arquivo" : "Enviar arquivo"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(null)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {value ? (
        <p className="truncate text-xs text-muted-foreground">{value.split("/").pop()}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
