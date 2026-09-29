import { useState } from "react";

interface Props {
  busy: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export function ResolveForm({ busy, onConfirm, onCancel }: Props) {
  const [note, setNote] = useState("");

  return (
    <div className="actions">
      <input
        autoFocus
        value={note}
        placeholder="Descreva como foi resolvida"
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        disabled={!note.trim() || busy}
        onClick={() => onConfirm(note.trim())}
      >
        Confirmar
      </button>
      <button className="ghost" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
}
