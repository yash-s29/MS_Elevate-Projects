import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';

const FOODS = ['Banana', 'Orange', 'Pineapple', 'Tomato'];
const EMOJIS = { Banana: '🍌', Orange: '🍊', Pineapple: '🍍', Tomato: '🍅' };
const RANGES = { temp: [-10, 60], humid: [0, 100], light: [0, 20000], co2: [200, 10000] };

function pct(val, key) {
  if (val === '' || val === undefined) return 0;
  const [mn, mx] = RANGES[key];
  return Math.min(100, Math.max(0, ((parseFloat(val) - mn) / (mx - mn)) * 100));
}

// 🔒 KEEP THIS LOGIC (unchanged)
function runModel(fruit, temp, humid, light, co2) {
  const t = +temp, h = +humid, l = +light, c = +co2;
  let score = 0;
  if (t > 30) score += 2; else if (t > 22) score += 1;
  if (h > 85) score += 2; else if (h > 70) score += 1;
  if (l > 5000) score += 1;
  if (c > 2000) score += 2; else if (c > 1000) score += 1;
  if (fruit === 'Banana' && t > 13) score += 1;
  if (fruit === 'Orange' && h > 80) score += 1;
  if (fruit === 'Tomato' && t < 10) score += 1;
  if (fruit === 'Pineapple' && t > 28) score += 1;
  return score >= 3 ? 'Bad' : 'Good';
}

export default function PredictorForm({
  defaults = {},
  title = 'Storage Condition Analysis',
  subtitle = 'Input your current storage parameters below. Our model will instantly assess spoilage risk.',
  btnLabel = 'Analyze Spoilage Risk',
}) {
  const navigate = useNavigate();
  const { addRecord } = useHistory();

  const [form, setForm] = useState({
    fruit: defaults.fruit || '',
    temp:  defaults.temp  !== undefined ? String(defaults.temp)  : '',
    humid: defaults.humid !== undefined ? String(defaults.humid) : '',
    light: defaults.light !== undefined ? String(defaults.light) : '',
    co2:   defaults.co2   !== undefined ? String(defaults.co2)   : '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fruit) e.fruit = 'Please select a food item.';

    const t = parseFloat(form.temp);
    if (form.temp === '') e.temp = 'Required.';
    else if (isNaN(t) || t < -10 || t > 60) e.temp = 'Must be −10 to 60 °C.';

    const h = parseFloat(form.humid);
    if (form.humid === '') e.humid = 'Required.';
    else if (isNaN(h) || h < 0 || h > 100) e.humid = 'Must be 0–100%.';

    const l = parseFloat(form.light);
    if (form.light === '') e.light = 'Required.';
    else if (isNaN(l) || l < 0 || l > 20000) e.light = 'Must be 0–20,000 lux.';

    const c = parseFloat(form.co2);
    if (form.co2 === '') e.co2 = 'Required.';
    else if (isNaN(c) || c < 200 || c > 10000) e.co2 = 'Must be 200–10,000 ppm.';

    return e;
  };

  // 🔥 ONLY CHANGE IS HERE
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // ✅ ALL FACTORS INCLUDED
      });

      if (!res.ok) throw new Error('Server error');

      const { prediction } = await res.json();

      const rec = addRecord({ ...form, prediction });

      navigate('/result', {
        state: { ...form, prediction, id: rec.id },
      });

    } catch (err) {
      console.error(err);

      // fallback (logic unchanged)
      const prediction = runModel(
        form.fruit,
        form.temp,
        form.humid,
        form.light,
        form.co2
      );

      const rec = addRecord({ ...form, prediction });

      navigate('/result', {
        state: { ...form, prediction, id: rec.id, fallback: true },
      });

    } finally {
      setLoading(false);
    }
  };

  const SpinSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );

  return (
    <section className="card predictor-card">
      <div className="section-header">
        <span className="badge">🔬 PREDICTION ENGINE</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form className="pred-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">

          {/* Food */}
          <div className="form-group">
            <label className="form-label">Food Item</label>
            <div className="select-wrap">
              <select value={form.fruit} onChange={e => set('fruit', e.target.value)}
                className={errors.fruit ? 'error' : ''}>
                <option value="">Select a food item</option>
                {FOODS.map(f => (
                  <option key={f} value={f}>
                    {EMOJIS[f]} {f}
                  </option>
                ))}
              </select>
              <span className="select-arrow">&#9662;</span>
            </div>
            {errors.fruit && <span className="field-error">{errors.fruit}</span>}
          </div>

          {/* Temperature */}
          <div className="form-group">
            <label className="form-label">Temperature</label>
            <div className="input-wrap">
              <input type="number" step="0.1" placeholder="e.g. 22"
                value={form.temp} onChange={e => set('temp', e.target.value)}
                className={errors.temp ? 'error' : ''} />
              <span className="input-unit">°C</span>
            </div>
            <div className="slider-bar">
              <div className="slider-fill" style={{ width: pct(form.temp, 'temp') + '%' }} />
            </div>
            {errors.temp && <span className="field-error">{errors.temp}</span>}
          </div>

          {/* Humidity */}
          <div className="form-group">
            <label className="form-label">Humidity</label>
            <div className="input-wrap">
              <input type="number" step="0.1" placeholder="e.g. 85"
                value={form.humid} onChange={e => set('humid', e.target.value)}
                className={errors.humid ? 'error' : ''} />
              <span className="input-unit">%</span>
            </div>
            <div className="slider-bar">
              <div className="slider-fill" style={{ width: pct(form.humid, 'humid') + '%' }} />
            </div>
            {errors.humid && <span className="field-error">{errors.humid}</span>}
          </div>

          {/* Light */}
          <div className="form-group">
            <label className="form-label">Light Exposure</label>
            <div className="input-wrap">
              <input type="number" step="0.1" placeholder="e.g. 500"
                value={form.light} onChange={e => set('light', e.target.value)}
                className={errors.light ? 'error' : ''} />
              <span className="input-unit">Lux</span>
            </div>
            <div className="slider-bar">
              <div className="slider-fill" style={{ width: pct(form.light, 'light') + '%' }} />
            </div>
            {errors.light && <span className="field-error">{errors.light}</span>}
          </div>

          {/* CO2 */}
          <div className="form-group">
            <label className="form-label">CO₂ Level</label>
            <div className="input-wrap">
              <input type="number" step="0.1" placeholder="e.g. 400"
                value={form.co2} onChange={e => set('co2', e.target.value)}
                className={errors.co2 ? 'error' : ''} />
              <span className="input-unit">ppm</span>
            </div>
            <div className="slider-bar">
              <div className="slider-fill" style={{ width: pct(form.co2, 'co2') + '%' }} />
            </div>
            {errors.co2 && <span className="field-error">{errors.co2}</span>}
          </div>

        </div>

        <div className="form-footer-row">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><SpinSVG /> Processing…</> : btnLabel}
          </button>
          <p className="form-note">🔒 All analysis is processed securely and instantly</p>
        </div>
      </form>
    </section>
  );
}