import { useState } from 'react';
import {
  STATUS_LABEL,
  TYPE_LABEL,
  TYPE_WEIGHT,
  type Occurrence,
} from '../types/occurrence';
import { ResolveForm } from '../ResolveForm';

interface Props {
  occurrence: Occurrence;
  busy: boolean;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string, note: string) => void;
}

export function OccurrenceCard({
  occurrence: o,
  busy,
  onAcknowledge,
  onResolve,
}: Props) {
  const [resolving, setResolving] = useState(false);

  return (
    <li className={`card sev-${o.severity}`}>
      <div className="row">
        <span className={`badge sev-${o.severity}`} title="Severidade">
          {o.severity}
        </span>

        <div className="info">
          <strong>{TYPE_LABEL[o.type]}</strong>
          <span className="muted">
            Site {o.siteId} · Drone {o.droneId} ·{' '}
            {new Date(o.detectedAt).toLocaleString('pt-BR')}
          </span>
        </div>

        {o.count > 1 && (
          <span className="repeat" title="Alertas agrupados">
            {o.count}× repetida
          </span>
        )}
        <span className="prio" title="Severidade × peso do tipo">
          prioridade {o.severity * TYPE_WEIGHT[o.type]}
        </span>
        <span className={`status ${o.status}`}>{STATUS_LABEL[o.status]}</span>
      </div>

      {o.status === 'resolved' && o.note && (
        <p className="note">Nota: {o.note}</p>
      )}

      {o.status === 'open' && (
        <div className="actions">
          <button disabled={busy} onClick={() => onAcknowledge(o._id)}>
            Reconhecer
          </button>
        </div>
      )}

      {o.status === 'acknowledged' &&
        (resolving ? (
          <ResolveForm
            busy={busy}
            onCancel={() => setResolving(false)}
            onConfirm={(note) => onResolve(o._id, note)}
          />
        ) : (
          <div className="actions">
            <button onClick={() => setResolving(true)}>Resolver</button>
          </div>
        ))}
    </li>
  );
}
