import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';

const FOODS  = ['Banana', 'Orange', 'Pineapple', 'Tomato'];
const EMOJIS = { Banana: '🍌', Orange: '🍊', Pineapple: '🍍', Tomato: '🍅' };

const RANGES = {
  temp:  [-10, 60],
  humid: [0, 100],
  light: [0, 20000],
  co2:   [200, 10000],
};

const BASE = 'http://127.0.0.1:5000';

const pct = (val, key) => {
  if (val === '') return 0;
  const [mn, mx] = RANGES[key];
  return Math.min(100, Math.max(0, ((parseFloat(val) - mn) / (mx - mn)) * 100));
};

/* Simple offline fallback model */
function runModel(fruit, temp, humid, light, co2) {
  const t = +temp, h = +humid, l = +light, c = +co2;
  let s = 0;
  if (t > 30) s += 2; else if (t > 22) s += 1;
  if (h > 85) s += 2; else if (h > 70) s += 1;
  if (l > 5000) s += 1;
  if (c > 2000) s += 2; else if (c > 1000) s += 1;
  if (fruit === 'Banana'    && t > 13) s += 1;
  if (fruit === 'Orange'    && h > 80) s += 1;
  if (fruit === 'Tomato'    && t < 10) s += 1;
  if (fruit === 'Pineapple' && t > 28) s += 1;
  return s >= 3 ? 'Bad' : 'Good';
}

const FIELDS = [
  { key: 'temp',  label: 'Temperature',    unit: '°C',  ph: 'e.g. 22',  hint: '−10 to 60 °C'        },
  { key: 'humid', label: 'Humidity',       unit: '%',   ph: 'e.g. 85',  hint: '0 to 100 %'           },
  { key: 'light', label: 'Light Exposure', unit: 'lux', ph: 'e.g. 500', hint: '0 to 20,000 lux'      },
  { key: 'co2',   label: 'CO₂ Level',      unit: 'ppm', ph: 'e.g. 400', hint: '200 to 10,000 ppm'    },
];

export default function PredictorForm({
  defaults  = {},
  title     = 'Storage Condition Analysis',
  subtitle  = 'Input your current storage parameters. Our model will instantly assess spoilage risk.',
  btnLabel  = 'Analyze Spoilage Risk →',
}) {
  const navigate       = useNavigate();
  const { addRecord }  = useHistory();

  const [form, setForm] = useState({
    fruit: defaults.fruit || '',
    temp:  defaults.temp  !== undefined ? String(defaults.temp)  : '',
    humid: defaults.humid !== undefined ? String(defaults.humid) : '',
    light: defaults.light !== undefined ? String(defaults.light) : '',
    co2:   defaults.co2   !== undefined ? String(defaults.co2)   : '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fruit) e.fruit = 'Please select a food item.';
    const t = parseFloat(form.temp);
    if (form.temp === '')                    e.temp  = 'Required.';
    else if (isNaN(t) || t < -10 || t > 60) e.temp  = 'Must be −10 to 60 °C.';
    const h = parseFloat(form.humid);
    if (form.humid === '')                   e.humid = 'Required.';
    else if (isNaN(h) || h < 0 || h > 100)  e.humid = 'Must be 0–100 %.';
    const l = parseFloat(form.light);
    if (form.light === '')                   e.light = 'Required.';
    else if (isNaN(l) || l < 0 || l > 20000) e.light = 'Must be 0–20,000 lux.';
    const c = parseFloat(form.co2);
    if (form.co2 === '')                     e.co2   = 'Required.';
    else if (isNaN(c) || c < 200 || c > 10000) e.co2 = 'Must be 200–10,000 ppm.';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const payload = {
      fruit: form.fruit,
      temp:  parseFloat(form.temp),
      humid: parseFloat(form.humid),
      light: parseFloat(form.light),
      co2:   parseFloat(form.co2),
    };

    try {
      const res = await fetch(`${BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      const prediction = data.prediction ?? 'Good';
      const confidence = typeof data.confidence === 'number' ? data.confidence : null;
      const id         = data.id ?? Date.now();

      addRecord({ ...payload, id, prediction, confidence });
      navigate('/result', { state: { ...payload, prediction, confidence, id } });

    } catch {
      /* Offline fallback */
      const prediction = runModel(payload.fruit, payload.temp, payload.humid, payload.light, payload.co2);
      const id         = Date.now();
      addRecord({ ...payload, prediction, confidence: null, offline: true });
      navigate('/result', { state: { ...payload, prediction, confidence: null, id, offline: true } });

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="section-header">
        <span className="badge">🔬 PREDICTION ENGINE</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">

          {/* Food selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="pf-food">
              Food Item <span style={{ color: 'var(--danger)' }} aria-hidden="true">*</span>
            </label>
            <div className="select-wrap">
              <select
                id="pf-food"
                value={form.fruit}
                onChange={e => set('fruit', e.target.value)}
                className={errors.fruit ? 'error' : ''}
                aria-invalid={!!errors.fruit}
                aria-required="true"
              >
                <option value="">Select a food item</option>
                {FOODS.map(f => (
                  <option key={f} value={f}>{EMOJIS[f]} {f}</option>
                ))}
              </select>
              <span className="select-arrow" aria-hidden="true">▾</span>
            </div>
            {errors.fruit && <span className="field-error" role="alert">{errors.fruit}</span>}
          </div>

          {/* Numeric fields */}
          {FIELDS.map(({ key, label, unit, ph, hint }) => (
            <div key={key} className="form-group">
              <label className="form-label" htmlFor={`pf-${key}`}>
                {label} <span style={{ color: 'var(--danger)' }} aria-hidden="true">*</span>
              </label>
              <div className="input-wrap">
                <input
                  id={`pf-${key}`}
                  type="number"
                  step="0.1"
                  placeholder={ph}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  className={errors[key] ? 'error' : ''}
                  aria-invalid={!!errors[key]}
                  aria-required="true"
                  inputMode="decimal"
                />
                <span className="input-unit" aria-hidden="true">{unit}</span>
              </div>

              {/* Visual fill bar */}
              <div className="slider-bar" aria-hidden="true">
                <div className="slider-fill" style={{ width: pct(form[key], key) + '%' }} />
              </div>

              <span className="field-hint">Range: {hint}</span>
              {errors[key] && <span className="field-error" role="alert">{errors[key]}</span>}
            </div>
          ))}

        </div>

        <div className="form-footer-row">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? '⏳ Processing…' : btnLabel}
          </button>
          <p className="form-note">
            <span aria-hidden="true">🔒</span>
            All analysis is processed securely and instantly
          </p>
        </div>
      </form>
    </section>
  );
}