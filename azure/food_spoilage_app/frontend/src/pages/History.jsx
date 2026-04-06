import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import Reveal from '../components/Reveal';

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

function DeleteModal({ record, onClose, onConfirm }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!record) return null;
  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-box">
        <div className="modal-head">
          <h3>Delete Record</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <span className="delete-icon">🗑️</span>
          <p>Are you sure you want to delete this prediction?</p>
          <div className="record-preview">
            <div className="preview-row"><span>Food Item:</span><strong>{record.fruit}</strong></div>
            <div className="preview-row"><span>Status:</span><strong>{record.prediction}</strong></div>
          </div>
          <p className="warning-note">⚠ This action cannot be undone.</p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(record.id); onClose(); }}>Delete Record</button>
        </div>
      </div>
    </div>
  );
}

function StatusModal({ record, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!record) return null;
  const good = record.prediction === 'Good';
  return (
    <div className="modal open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-box">
        <div className="modal-head">
          <h3>Storage Status</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="status-result">
            <span className="result-icon">{good ? '✅' : '⚠️'}</span>
            <h4>{good ? 'Storage Conditions Optimal' : 'Spoilage Risk Detected'}</h4>
            <p>{good
              ? 'Your environment is well-maintained and food is at low risk of spoilage.'
              : 'Current conditions may accelerate food deterioration.'
            }</p>
            <ul className="result-tips" style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
              {good ? (
                <>
                  <li style={{ paddingLeft: 16, position: 'relative', marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-2)' }}>Temperature and humidity are within ideal ranges</li>
                  <li style={{ paddingLeft: 16, position: 'relative', marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-2)' }}>Light exposure is minimal</li>
                  <li style={{ paddingLeft: 16, position: 'relative', fontSize: '0.9rem', color: 'var(--text-2)' }}>CO₂ levels are appropriate</li>
                </>
              ) : (
                <>
                  <li style={{ paddingLeft: 16, position: 'relative', marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-2)' }}>Check and adjust temperature settings</li>
                  <li style={{ paddingLeft: 16, position: 'relative', marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-2)' }}>Regulate humidity levels</li>
                  <li style={{ paddingLeft: 16, position: 'relative', fontSize: '0.9rem', color: 'var(--text-2)' }}>Minimize light exposure where possible</li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>Got It</button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const { records, deleteRecord } = useHistory();
  const [delTarget, setDelTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const fmt = (v, d=1) => { const n = parseFloat(v); return isNaN(n) ? v : n.toFixed(d); };

  return (
    <>
      <header className="page-header">
        <div className="orb orb-sm orb-1" />
        <div className="orb orb-sm orb-2" />
        <div className="page-header-inner">
          <div className="eyebrow">📋 Your Records</div>
          <h1 className="page-title">Prediction History</h1>
          <p className="page-sub">View and manage all your past storage analysis records.</p>
        </div>
      </header>

      <main className="main-container">
        {records.length > 0 ? (
          <Reveal>
            <section className="card history-card">
              <div className="history-header">
                <div>
                  <span className="badge">📋 ANALYSIS RECORDS</span>
                  <h2>Your Predictions</h2>
                  <p>{records.length} record{records.length !== 1 ? 's' : ''} found</p>
                </div>
                <Link to="/" className="btn btn-secondary">+ New Prediction</Link>
              </div>

              {/* Desktop table */}
              <div className="table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Food Item</th><th>Temp</th><th>Humidity</th>
                      <th>Light</th><th>CO&#8322;</th><th>Status</th><th>Date</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(row => (
                      <tr key={row.id} className="table-row">
                        <td><span className="food-chip">{row.fruit}</span></td>
                        <td>{fmt(row.temp)}°C</td>
                        <td>{fmt(row.humid)}%</td>
                        <td>{fmt(row.light, 0)} lux</td>
                        <td>{fmt(row.co2, 0)} ppm</td>
                        <td>
                          <button
                            className={'status-pill ' + (row.prediction === 'Good' ? 'status-good' : 'status-bad')}
                            onClick={() => setStatusTarget(row)}
                          >
                            {row.prediction === 'Good' ? '✓ Good' : '⚠ At Risk'}
                          </button>
                        </td>
                        <td className="date-cell">{(row.timestamp || '').split(' ')[0]}</td>
                        <td>
                          <button className="btn-delete" onClick={() => setDelTarget(row)} aria-label="Delete">
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="history-mobile">
                {records.map(row => (
                  <div key={row.id} className="history-mob-card">
                    <div className="mob-card-top">
                      <span className="food-chip">{row.fruit}</span>
                      <button
                        className={'status-pill ' + (row.prediction === 'Good' ? 'status-good' : 'status-bad')}
                        onClick={() => setStatusTarget(row)}
                      >
                        {row.prediction === 'Good' ? '✓ Good' : '⚠ At Risk'}
                      </button>
                    </div>
                    <div className="mob-card-params">
                      <span>🌡️ {fmt(row.temp)}°C</span>
                      <span>💧 {fmt(row.humid)}%</span>
                      <span>💡 {fmt(row.light, 0)} lux</span>
                      <span>🌫️ {fmt(row.co2, 0)} ppm</span>
                    </div>
                    <div className="mob-card-foot">
                      <span className="date-cell">{(row.timestamp || '').split(' ')[0]}</span>
                      <button className="btn-delete" onClick={() => setDelTarget(row)}>
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal>
            <section className="card empty-card">
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No Predictions Yet</h2>
                <p>Start analyzing your storage conditions to see results here.</p>
                <Link to="/" className="btn btn-primary">Make Your First Prediction →</Link>
              </div>
            </section>
          </Reveal>
        )}
      </main>

      <DeleteModal record={delTarget} onClose={() => setDelTarget(null)} onConfirm={deleteRecord} />
      <StatusModal record={statusTarget} onClose={() => setStatusTarget(null)} />
    </>
  );
}
