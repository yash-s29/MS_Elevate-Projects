import { useLocation, Link, Navigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import PredictorForm from '../components/PredictorForm';

export default function Result() {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;
  const { fruit, temp, humid, light, co2, prediction, offline } = state;
  const good = prediction === 'Good';

  return (
    <main className="main-container result-main">

      <Reveal>
        <section className={'card result-card ' + (good ? 'result-good' : 'result-bad')}>

          {offline && (
            <div style={{
              background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.3)',
              borderRadius:'var(--r-sm)', padding:'8px 14px', marginBottom:'16px',
              fontSize:'.82rem', color:'var(--text-muted)'
            }}>
              ⚠️ Using offline prediction — connect Flask backend for ML results.
            </div>
          )}

          <div className="result-header">
            <div className={'result-icon-wrap ' + (good ? 'result-icon-good' : 'result-icon-bad')}>
              {good ? '✅' : '⚠️'}
            </div>
            <h1 className="result-title">{good ? 'Conditions Look Good' : 'Spoilage Risk Detected'}</h1>
            <p className="result-subtitle">
              {good
                ? <span>Your storage environment is safe for <strong>{fruit}</strong>.</span>
                : <span>Conditions may accelerate spoilage of <strong>{fruit}</strong>.</span>
              }
            </p>
          </div>

          <div className="result-params">
            {[
              {icon:'🌡️', label:'Temperature', val:temp+'°C'},
              {icon:'💧', label:'Humidity',    val:humid+'%'},
              {icon:'💡', label:'Light',       val:light+' lux'},
              {icon:'🌫️', label:'CO₂',         val:co2+' ppm'},
            ].map(p => (
              <div key={p.label} className="result-param">
                <span className="param-label">{p.icon} {p.label}</span>
                <span className="param-val">{p.val}</span>
              </div>
            ))}
          </div>

          {good ? (
            <div className="result-tips result-tips-good">
              <h3>✅ What This Means</h3>
              <ul>
                <li>Temperature and humidity are within safe limits</li>
                <li>Light exposure is well-controlled</li>
                <li>CO₂ levels indicate minimal microbial activity</li>
                <li>Continue monitoring to maintain these conditions</li>
              </ul>
            </div>
          ) : (
            <div className="result-tips result-tips-bad">
              <h3>⚠️ Recommended Actions</h3>
              <ul>
                <li>Adjust storage temperature if above optimal range</li>
                <li>Reduce humidity to prevent mold growth</li>
                <li>Move to a darker storage location</li>
                <li>Ensure proper ventilation to reduce CO₂ buildup</li>
              </ul>
            </div>
          )}

          <div className="result-actions">
            <Link to="/"        className="btn btn-primary">← New Prediction</Link>
            <Link to="/history" className="btn btn-secondary">View History</Link>
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <PredictorForm
          defaults={{fruit, temp, humid, light, co2}}
          title="Run Another Analysis"
          subtitle="Adjust your parameters and predict again."
          btnLabel="Analyze Again"
        />
      </Reveal>

    </main>
  );
}
