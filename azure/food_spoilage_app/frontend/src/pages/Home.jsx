import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import PredictorForm from '../components/PredictorForm';

export default function Home() {
  return (
    <>
      {/* 🔥 HERO */}
      <header className="hero advanced-hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <motion.div
          className="hero-inner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow">🔬 ML-Powered Food Analysis</div>

          <h1 className="hero-title">
            Predict Food Spoilage <br />
            <span className="gradient-text">Before It Happens</span>
          </h1>

          <p className="hero-sub">
            Enter your storage conditions and get instant AI-powered spoilage
            risk assessment — no guesswork, just data.
          </p>

          <div className="hero-actions">
            <motion.a
              href="#predictor"
              className="btn btn-primary glow-btn"
              whileHover={{ scale: 1.05 }}
            >
              Start Predicting →
            </motion.a>

            <Link to="/about" className="btn btn-ghost">
              Learn More
            </Link>
          </div>

          {/* STATS */}
          <div className="hero-stats glass-card">
            <div className="stat">
              <strong>4</strong>
              <span>Food Items</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>4</strong>
              <span>Parameters</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong>ML</strong>
              <span>Powered</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* MAIN */}
      <main className="main-container">

        {/* 🔮 PREDICTOR */}
        <div id="predictor">
          <Reveal>
            <PredictorForm />
          </Reveal>
        </div>

        {/* INFO CARDS */}
        <Reveal delay={100}>
          <div className="info-grid">
            {[
              {
                title: 'Input Real Conditions',
                body: 'Provide temperature, humidity, light exposure, and CO₂ concentration.',
              },
              {
                title: 'ML Model Analysis',
                body: 'Our trained model evaluates spoilage risk based on real patterns.',
              },
              {
                title: 'Actionable Output',
                body: 'Get clear Good/Bad prediction with insights to improve storage.',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                className="info-card glass-card hover-lift"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={160}>
          <section className="card cta-card glass-card">
            <div className="cta-inner">

              <div className="cta-text">
                <span className="badge">🌱 WHY IT MATTERS</span>
                <h2>Stop Guessing. Start Knowing.</h2>

                <p>
                  Most food waste happens due to uncertainty — not actual spoilage.
                  SpoilageAI replaces guesswork with real-time analysis.
                </p>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/about" className="btn btn-secondary glow-btn">
                    Explore More →
                  </Link>
                </motion.div>
              </div>

              <div className="cta-visual">
                <motion.div
                  className="cta-stat-box"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="big-stat">1/3</div>
                  <div className="big-stat-label">
                    Global food is wasted
                  </div>
                </motion.div>
              </div>

            </div>
          </section>
        </Reveal>

      </main>

      {/* 🎨 STYLES */}
      <style>
        {`
        .advanced-hero {
          position: relative;
          overflow: hidden;
        }

        .gradient-text {
          background: linear-gradient(90deg, #6ee7b7, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        .glow-btn {
          box-shadow: 0 0 20px rgba(59,130,246,0.5);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .info-card {
          padding: 20px;
          border-radius: 14px;
        }

        .orb {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(40px);
        }

        .orb-1 {
          background: rgba(59,130,246,0.4);
          top: -50px;
          left: -50px;
        }

        .orb-2 {
          background: rgba(16,185,129,0.4);
          bottom: -50px;
          right: -50px;
        }

        .orb-3 {
          background: rgba(139,92,246,0.4);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        `}
      </style>
    </>
  );
}