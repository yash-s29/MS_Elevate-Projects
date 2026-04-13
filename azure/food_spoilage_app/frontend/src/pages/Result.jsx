import { useLocation, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import PredictorForm from '../components/PredictorForm';

const TIPS_GOOD = [
  'Monitor storage conditions daily to maintain safety.',
  'Ensure adequate ventilation to keep CO₂ levels low.',
  'Keep temperature consistent to prevent condensation.',
];
const TIPS_BAD = [
  'Lower temperature by 3–5 °C if possible.',
  'Reduce humidity below 70 % to limit mold growth.',
  'Improve air circulation to reduce CO₂ buildup.',
  'Consider moving food to a cooler, drier location.',
];

export default function Result() {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  const { fruit, temp, humid, light, co2, prediction, confidence, offline } = state;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const good = prediction === 'Good';
  const conf = typeof confidence === 'number' && !isNaN(confidence) ? confidence : null;
  const tips = good ? TIPS_GOOD : TIPS_BAD;

  /* Loading state */
  if (!ready) return (
    <main className="main-container result-main">
      <div className="card result-loading">
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔬</div>
        <h2>Analyzing Storage Conditions…</h2>
        <p>Evaluating your environment factors for accuracy</p>
        <div className="loader" />
      </div>
    </main>
  );

  return (
    <main className="main-container result-main">

      <Reveal>
        <section className={`card result-card ${good ? 'result-good' : 'result-bad'}`}>

          {/* Offline notice */}
          {offline && (
            <div className="offline-warning">
              ⚠️ Offline mode — prediction uses a built-in fallback model and may be approximate.
            </div>
          )}

          {/* Header */}
          <div className="result-header">
            <div className={`result-icon ${good ? 'good' : 'bad'}`} aria-hidden="true">
              {good ? '✅' : '⚠️'}
            </div>
            <div>
              <h1 className="result-title">
                {good ? 'Storage Conditions Are Safe' : 'High Spoilage Risk Detected'}
              </h1>
              <p className="result-subtitle">
                {good
                  ? `Your ${fruit} is stored under optimal conditions.`
                  : `Your ${fruit} may spoil faster under current conditions.`}
              </p>
            </div>
          </div>

          {/* Parameters */}
          <div className="result-grid">
            {[
              { icon: '🌡️', label: 'Temperature', val: `${temp} °C`    },
              { icon: '💧', label: 'Humidity',    val: `${humid} %`    },
              { icon: '💡', label: 'Light',       val: `${light} lux`  },
              { icon: '🌫️', label: 'CO₂ Level',  val: `${co2} ppm`    },
            ].map(({ icon, label, val }) => (
              <div key={label} className="result-item">
                <span>{icon} {label}</span>
                <strong>{val}</strong>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div className={`result-insight ${good ? 'good' : 'bad'}`}>
            <h3>{good ? '✅ Everything Looks Good' : '⚠️ Action Recommended'}</h3>
            <p>
              {good
                ? 'No immediate risk detected. Maintain current storage conditions.'
                : 'Adjust environmental factors to reduce spoilage risk.'}
            </p>
            <ul className="tips-list">
              {tips.map(tip => (
                <li key={tip}><span aria-hidden="true">›</span> {tip}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <Link to="/" className="btn btn-primary">← New Prediction</Link>
            <Link to="/history" className="btn btn-secondary">📜 View History</Link>
          </div>

        </section>
      </Reveal>

      {/* Re-run with pre-filled values */}
      <Reveal delay={150}>
        <PredictorForm
          defaults={{ fruit, temp, humid, light, co2 }}
          title="Run Another Analysis"
          subtitle="Adjust values and test different storage scenarios instantly."
          btnLabel="Analyze Again →"
        />
      </Reveal>

    </main>
  );
}