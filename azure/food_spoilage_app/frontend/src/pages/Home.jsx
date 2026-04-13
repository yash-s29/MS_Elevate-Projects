import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import PredictorForm from '../components/PredictorForm';

const INFO = [
  {
    icon: '📊',
    title: 'Input Real Conditions',
    body:  'Provide temperature, humidity, light exposure, and CO₂ levels for your stored food.',
  },
  {
    icon: '🤖',
    title: 'ML Model Analysis',
    body:  'A trained model evaluates your inputs against historical spoilage patterns instantly.',
  },
  {
    icon: '✅',
    title: 'Actionable Output',
    body:  'Get a clear Good / Bad result with guidance on improving your storage conditions.',
  },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="hero-inner">
          <div className="eyebrow">🔬 ML-Powered Food Analysis</div>

          <h1 className="hero-title">
            Predict Food Spoilage<br />
            <span className="gradient-text">Before It Happens</span>
          </h1>

          <p className="hero-sub">
            Enter your storage conditions and get instant AI-powered spoilage
            risk assessment — no guesswork, just data.
          </p>

          <div className="hero-actions">
            <a href="#predictor" className="btn btn-primary btn-lg">
              Start Predicting →
            </a>
            <Link to="/about" className="btn btn-ghost btn-lg">
              Learn More
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>4</strong>
              <span>Food Items</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat">
              <strong>4</strong>
              <span>Parameters</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat">
              <strong>ML</strong>
              <span>Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <main className="main-container">

        {/* Predictor form */}
        <section id="predictor">
          <Reveal>
            <PredictorForm />
          </Reveal>
        </section>

        {/* How it works cards */}
        <Reveal delay={80}>
          <div className="info-grid">
            {INFO.map(c => (
              <article key={c.title} className="info-card card-hover">
                <div className="info-card-icon" aria-hidden="true">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={140}>
          <section className="card cta-card">
            <div className="cta-inner">
              <div className="cta-text">
                <span className="badge">🌱 WHY IT MATTERS</span>
                <h2>Stop Guessing. Start Knowing.</h2>
                <p>
                  Most food waste happens due to uncertainty — not actual spoilage.
                  SpoilageAI replaces guesswork with real-time data-backed analysis.
                </p>
                <Link to="/about" className="btn btn-secondary">Explore More →</Link>
              </div>

              <div className="cta-visual" aria-hidden="true">
                <div className="cta-stat-box">
                  <div className="big-stat">1/3</div>
                  <div className="big-stat-label">of all food produced globally is wasted</div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

      </main>
    </>
  );
}