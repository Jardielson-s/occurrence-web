import { STATUS_LABEL, type Status } from '../types/occurrence';

const OPTIONS: { value: Status | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'open', label: STATUS_LABEL.open },
  { value: 'acknowledged', label: STATUS_LABEL.acknowledged },
  { value: 'resolved', label: STATUS_LABEL.resolved },
];

interface Props {
  value: Status | '';
  onChange: (value: Status | '') => void;
}

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="filters" role="group" aria-label="Filtrar por status">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          className={value === o.value ? 'chip on' : 'chip'}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
