import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const PARAMS = [
  { label:'Temperature (°C)',   desc:'Higher temps accelerate microbial growth and enzymatic reactions that spoil food faster.' },
  { label:'Humidity (%)',       desc:'Excessive moisture encourages mold, fungal, and bacterial growth on food surfaces.' },
  { label:'Light Exposure (Lux)', desc:'Light degrades vitamins, triggers oxidation, and accelerates ripening in many fruits.' },
  { label:'CO₂ Level (ppm)',    desc:'Elevated CO₂ can suppress respiration and indicate microbial activity in enclosed storage.' },
];
const STEPS = [
  { n:'01', title:'Input Real Conditions', body:'Provide measurable storage parameters — temperature, humidity, light and CO₂ for your food item.' },
  { n:'02', title:'ML Model Analysis',     body:'A trained classification model evaluates your parameters using patterns learned from historical data.' },
  { n:'03', title:'Actionable Output',     body:'Receive a clear result — safe or spoilage-risk — with specific guidance on what to adjust.' },
];

export default function About() {
  return (
    <>
      <header className="page-header">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="page-header-inner">
          <div className="eyebrow">ℹ️ Learn More</div>
          <h1 className="page-title">About <span className="gradient-text">SpoilageAI</span></h1>
          <p className="page-sub">Machine learning meets practical food storage solutions</p>
        </div>
      </header>

      <main className="main-container">

        <Reveal>
          <section className="card card-hover">
            <div className="two-col">
              <div className="two-col-text">
                <span className="badge">🎯 THE PROBLEM</span>
                <h2>Why Food Waste Is a Data Problem</h2>
                <p>Food spoilage is a leading cause of household and commercial food waste. Often food is discarded not because it's unsafe — but because its condition is uncertain.</p>
                <p style={{marginTop:'1rem'}}>SpoilageAI removes this uncertainty using data-driven insights based on real storage conditions.</p>
              </div>
              <div className="stat-block">
                <div className="stat-big">
                  <div className="stat-number">1.3B</div>
                  <div className="stat-desc">tonnes of food wasted globally per year</div>
                </div>
                <div className="stat-big">
                  <div className="stat-number">30%</div>
                  <div className="stat-desc">of all groceries in an average household</div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section>
            <div className="section-header centered">
              <span className="badge">⚙️ HOW IT WORKS</span>
              <h2>Three Steps to Smarter Storage</h2>
            </div>
            <div className="steps-grid">
              {STEPS.map((s,i) => (
                <div key={s.n} className="step-card">
                  <span className="step-num">STEP {s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={140}>
          <section className="card">
            <div className="section-header">
              <span className="badge">📋 PARAMETERS</span>
              <h2>What We Measure</h2>
              <p>Each parameter plays a critical role in determining how quickly food deteriorates.</p>
            </div>
            <div className="params-grid">
              {PARAMS.map(p => (
                <div key={p.label} className="param-row">
                  <div className="param-info">
                    <strong>{p.label}</strong>
                    <span>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={180}>
          <section className="card cta-card">
            <div className="cta-centered">
              <span className="badge">🚀 GET STARTED</span>
              <h2>Ready to Reduce Food Waste?</h2>
              <p>Use SpoilageAI to make evidence-based storage decisions and stop throwing food away unnecessarily.</p>
              <Link to="/" className="btn btn-primary btn-lg">Try the Predictor Now →</Link>
            </div>
          </section>
        </Reveal>

      </main>
    </>
  );
}
