import { FilterBar } from './components/FilterBar';
import { useOccurrences } from './components/useOccurrences';
import { OccurrenceCard } from './hooks/OccurrenceCard';

export default function App() {
  const {
    items,
    loading,
    error,
    busyId,
    filter,
    setFilter,
    acknowledge,
    resolve,
  } = useOccurrences();

  return (
    <main className="page">
      <header className="head">
        <h1>Triagem de ocorrências</h1>
        <FilterBar value={filter} onChange={setFilter} />
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Carregando…</p>}
      {!loading && !error && items.length === 0 && (
        <p className="muted">Nenhuma ocorrência para este filtro.</p>
      )}

      <ul className="list">
        {items.map((o) => (
          <OccurrenceCard
            key={o._id}
            occurrence={o}
            busy={busyId === o._id}
            onAcknowledge={acknowledge}
            onResolve={resolve}
          />
        ))}
      </ul>
    </main>
  );
}
