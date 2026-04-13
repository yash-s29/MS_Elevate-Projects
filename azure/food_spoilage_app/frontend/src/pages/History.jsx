import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';

const EMOJI = { Banana: '🍌', Orange: '🍊', Pineapple: '🍍', Tomato: '🍅' };

const fmt = (v, d = 1) => {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toFixed(d);
};

const normalize = row => ({
  id:         row.id,
  food:       row.food_item ?? row.fruit ?? '—',
  temp:       row.temperature ?? row.temp,
  humid:      row.humidity ?? row.humid,
  light:      row.light,
  co2:        row.co2,
  prediction: row.prediction,
  confidence: row.confidence,
  created_at: row.created_at,
});

const fmtDate = d =>
  d
    ? new Date(d).toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

export default function History() {
  const { records, deleteRecord, loadingHistory, refreshHistory } = useHistory();
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage]       = useState('');
  const [msgError, setMsgError]     = useState(false);

  const handleDelete = async id => {
    setDeletingId(id);
    const result = await deleteRecord(id);
    if (result.success) {
      setMessage('Record deleted successfully.');
      setMsgError(false);
    } else {
      setMessage('Delete failed: ' + result.error);
      setMsgError(true);
    }
    setTimeout(() => setMessage(''), 3000);
    setDeletingId(null);
  };

  /* ── Loading ── */
  if (loadingHistory) return (
    <main className="main-container">
      <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div className="loader" style={{ margin: '0 auto 18px' }} />
        <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Loading prediction history…</p>
      </div>
    </main>
  );

  /* ── Empty ── */
  if (records.length === 0) return (
    <main className="main-container">
      <div className="card empty-card">
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h2>No Predictions Yet</h2>
          <p>Run your first spoilage prediction to see your history here.</p>
          <Link to="/" className="btn btn-primary">Make a Prediction →</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="main-container">

      {/* Header */}
      <div className="history-header">
        <div>
          <div className="eyebrow" style={{ marginBottom: '10px' }}>📜 Records</div>
          <h2>Prediction History</h2>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={refreshHistory}
          disabled={loadingHistory}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Status toast */}
      {message && (
        <div className={`status-message${msgError ? ' error' : ''}`} role="alert">
          {msgError ? '❌' : '✅'} {message}
        </div>
      )}

      {/* ── DESKTOP TABLE ──────────────────────────────────────── */}
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Food</th>
              <th>Temp °C</th>
              <th>Humidity %</th>
              <th>Light lux</th>
              <th>CO₂ ppm</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Created</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {records.map(row => {
              const r = normalize(row);
              const busy = deletingId === r.id;
              return (
                <tr key={r.id} className={busy ? 'faded-row' : ''}>
                  <td style={{ color: 'var(--text-faint)', fontSize: '.80rem' }}>#{r.id}</td>
                  <td style={{ fontWeight: 700 }}>
                    {EMOJI[r.food] || '🥬'} {r.food}
                  </td>
                  <td>{fmt(r.temp)}</td>
                  <td>{fmt(r.humid)}</td>
                  <td>{fmt(r.light)}</td>
                  <td>{fmt(r.co2)}</td>
                  <td>
                    <span className={`status ${r.prediction}`}>
                      {r.prediction === 'Good' ? '✓ Good' : '⚠ Bad'}
                    </span>
                  </td>
                  <td>
                    {typeof r.confidence === 'number'
                      ? `${(r.confidence * 100).toFixed(1)}%`
                      : '—'}
                  </td>
                  <td style={{ color: 'var(--text-faint)', fontSize: '.80rem' }}>
                    {fmtDate(r.created_at)}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(r.id)}
                      disabled={busy}
                      aria-label={`Delete record #${r.id}`}
                    >
                      {busy ? '⏳' : '🗑 Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ─────────────────────────────────────────── */}
      <div className="history-mobile">
        {records.map(row => {
          const r    = normalize(row);
          const busy = deletingId === r.id;
          return (
            <article key={r.id} className={`history-mob-card${busy ? ' faded-row' : ''}`}>
              <div className="mob-card-top">
                <div className="mob-food-label">
                  <span aria-hidden="true">{EMOJI[r.food] || '🥬'}</span>
                  {r.food}
                </div>
                <span className={`status ${r.prediction}`}>
                  {r.prediction === 'Good' ? '✓ Good' : '⚠ Bad'}
                </span>
              </div>

              <div className="mob-card-params">
                <span>🌡️ {fmt(r.temp)} °C</span>
                <span>💧 {fmt(r.humid)} %</span>
                <span>💡 {fmt(r.light)} lux</span>
                <span>🌫️ {fmt(r.co2)} ppm</span>
              </div>

              <div className="mob-card-foot">
                <div>
                  {typeof r.confidence === 'number' && (
                    <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '3px' }}>
                      Confidence: {(r.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                  <div className="mob-card-date">{fmtDate(r.created_at)}</div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(r.id)}
                  disabled={busy}
                  aria-label={`Delete record for ${r.food}`}
                >
                  {busy ? '⏳' : '🗑 Delete'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

    </main>
  );
}