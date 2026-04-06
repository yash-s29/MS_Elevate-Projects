import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';

const PARAMS = [
  { label: 'Temperature (°C)', desc: 'Higher temps accelerate microbial growth and enzymatic reactions that spoil food faster.' },
  { label: 'Humidity (%)', desc: 'Excessive moisture encourages mold, fungal, and bacterial growth on food surfaces.' },
  { label: 'Light Exposure (Lux)', desc: 'Light degrades vitamins, triggers oxidation, and accelerates ripening in many fruits.' },
  { label: 'CO₂ Level (ppm)', desc: 'Elevated CO₂ can suppress respiration and indicate microbial activity in enclosed storage.' },
];

const STEPS = [
  { n: '01', title: 'Input Real Conditions', body: 'Provide measurable storage parameters — temperature, humidity, light exposure, and CO₂ concentration for your food item.' },
  { n: '02', title: 'ML Model Analysis', body: 'A trained classification model evaluates your parameters using patterns learned from historical spoilage data.' },
  { n: '03', title: 'Actionable Output', body: 'Receive a clear result — safe or spoilage-risk — with specific guidance on what conditions to adjust.' },
];

export default function About() {
  return (
    <>
      {/* 🔥 HERO */}
      <header className="page-header advanced-header">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <motion.div
          className="page-header-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="eyebrow">ℹ️ Learn More</div>
          <h1 className="page-title gradient-text">About SpoilageAI</h1>
          <p className="page-sub">
            Machine learning meets practical food storage solutions
          </p>
        </motion.div>
      </header>

      <main className="main-container">

        {/* PROBLEM */}
        <Reveal>
          <section className="card glass-card hover-lift">
            <div className="two-col">
              <div className="two-col-text">
                <span className="badge">🎯 THE PROBLEM</span>
                <h2>Why Food Waste Is a Data Problem</h2>
                <p>
                  Food spoilage is a leading cause of waste. Often food is discarded not because it's unsafe — but because its condition is uncertain.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  SpoilageAI removes this uncertainty using real-time data and predictive modeling.
                </p>
              </div>

              <div className="stat-block">
                <motion.div whileHover={{ scale: 1.05 }} className="stat-big">
                  <div className="stat-number">1.3B</div>
                  <div className="stat-desc">tonnes wasted yearly</div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="stat-big">
                  <div className="stat-number">30%</div>
                  <div className="stat-desc">household waste</div>
                </motion.div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* STEPS */}
        <Reveal delay={80}>
          <section>
            <div className="section-header centered">
              <span className="badge">⚙️ HOW IT WORKS</span>
              <h2>Three Steps to Smarter Storage</h2>
            </div>

            <div className="steps-grid">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  className="step-card glass-card hover-lift"
                  whileHover={{ y: -6 }}
                >
                  <span className="step-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* PARAMETERS */}
        <Reveal delay={140}>
          <section className="card glass-card">
            <div className="section-header">
              <span className="badge">📋 PARAMETERS</span>
              <h2>What We Measure</h2>
              <p>Each parameter plays a critical role in spoilage.</p>
            </div>

            <div className="params-grid">
              {PARAMS.map(p => (
                <motion.div
                  key={p.label}
                  className="param-row hover-lift"
                  whileHover={{ scale: 1.02 }}
                >
                  <strong>{p.label}</strong>
                  <span>{p.desc}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal delay={180}>
          <section className="card cta-card glass-card">
            <div className="cta-centered">
              <span className="badge">🚀 GET STARTED</span>
              <h2>Ready to Reduce Food Waste?</h2>
              <p>
                Make smarter decisions with real-time storage analysis.
              </p>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/" className="btn btn-primary btn-lg glow-btn">
                  Try the Predictor →
                </Link>
              </motion.div>
            </div>
          </section>
        </Reveal>

      </main>
    </>
  );
}