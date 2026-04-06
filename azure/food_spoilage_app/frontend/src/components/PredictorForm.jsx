import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';

const FOODS  = ['Banana', 'Orange', 'Pineapple', 'Tomato'];
const EMOJIS = { Banana:'🍌', Orange:'🍊', Pineapple:'🍍', Tomato:'🍅' };
const RANGES = { temp:[-10,60], humid:[0,100], light:[0,20000], co2:[200,10000] };

const pct = (val, key) => {
  if (val === '') return 0;
  const [mn,mx] = RANGES[key];
  return Math.min(100, Math.max(0, ((parseFloat(val)-mn)/(mx-mn))*100));
};

function runModel(fruit, temp, humid, light, co2) {
  const t=+temp, h=+humid, l=+light, c=+co2;
  let s=0;
  if(t>30) s+=2; else if(t>22) s+=1;
  if(h>85) s+=2; else if(h>70) s+=1;
  if(l>5000) s+=1;
  if(c>2000) s+=2; else if(c>1000) s+=1;
  if(fruit==='Banana'    && t>13) s+=1;
  if(fruit==='Orange'    && h>80) s+=1;
  if(fruit==='Tomato'    && t<10) s+=1;
  if(fruit==='Pineapple' && t>28) s+=1;
  return s>=3 ? 'Bad' : 'Good';
}

const FIELDS = [
  { key:'temp',  label:'Temperature',    unit:'°C',  ph:'e.g. 22',  hint:'Range: −10 to 60 °C' },
  { key:'humid', label:'Humidity',        unit:'%',   ph:'e.g. 85',  hint:'Range: 0 to 100 %' },
  { key:'light', label:'Light Exposure',  unit:'Lux', ph:'e.g. 500', hint:'Range: 0 to 20,000 lux' },
  { key:'co2',   label:'CO₂ Level',       unit:'ppm', ph:'e.g. 400', hint:'Range: 200 to 10,000 ppm' },
];

export default function PredictorForm({
  defaults={}, title='Storage Condition Analysis',
  subtitle='Input your current storage parameters. Our model will instantly assess spoilage risk.',
  btnLabel='Analyze Spoilage Risk',
}) {
  const navigate = useNavigate();
  const { addRecord } = useHistory();
  const [form, setForm] = useState({
    fruit: defaults.fruit||'',
    temp:  defaults.temp  !== undefined ? String(defaults.temp)  : '',
    humid: defaults.humid !== undefined ? String(defaults.humid) : '',
    light: defaults.light !== undefined ? String(defaults.light) : '',
    co2:   defaults.co2   !== undefined ? String(defaults.co2)   : '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})); };

  const validate = () => {
    const e={};
    if(!form.fruit) e.fruit='Please select a food item.';
    const t=parseFloat(form.temp);
    if(form.temp==='') e.temp='Required.';
    else if(isNaN(t)||t<-10||t>60) e.temp='Must be −10 to 60 °C.';
    const h=parseFloat(form.humid);
    if(form.humid==='') e.humid='Required.';
    else if(isNaN(h)||h<0||h>100) e.humid='Must be 0–100%.';
    const l=parseFloat(form.light);
    if(form.light==='') e.light='Required.';
    else if(isNaN(l)||l<0||l>20000) e.light='Must be 0–20,000 lux.';
    const c=parseFloat(form.co2);
    if(form.co2==='') e.co2='Required.';
    else if(isNaN(c)||c<200||c>10000) e.co2='Must be 200–10,000 ppm.';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const errs=validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch('/predict',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      if(!res.ok) throw new Error();
      const { prediction } = await res.json();
      const rec = addRecord({...form, prediction});
      navigate('/result',{state:{...form, prediction, id:rec.id}});
    } catch {
      const prediction = runModel(form.fruit,form.temp,form.humid,form.light,form.co2);
      const rec = addRecord({...form, prediction});
      navigate('/result',{state:{...form, prediction, id:rec.id, offline:true}});
    } finally { setLoading(false); }
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

          {/* Food Item */}
          <div className="form-group">
            <label className="form-label">Food Item</label>
            <div className="select-wrap">
              <select
                value={form.fruit} onChange={e=>set('fruit',e.target.value)}
                className={errors.fruit?'error':''}
              >
                <option value="">Select a food item</option>
                {FOODS.map(f=><option key={f} value={f}>{EMOJIS[f]} {f}</option>)}
              </select>
              <span className="select-arrow">▾</span>
            </div>
            {errors.fruit && <span className="field-error">{errors.fruit}</span>}
          </div>

          {/* Numeric fields */}
          {FIELDS.map(({key,label,unit,ph,hint})=>(
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <div className="input-wrap">
                <input
                  type="number" step="0.1" placeholder={ph}
                  inputMode="decimal"
                  value={form[key]} onChange={e=>set(key,e.target.value)}
                  className={errors[key]?'error':''}
                />
                <span className="input-unit">{unit}</span>
              </div>
              <div className="slider-bar">
                <div className="slider-fill" style={{width:pct(form[key],key)+'%'}} />
              </div>
              <span className="field-hint">{hint}</span>
              {errors[key] && <span className="field-error">{errors[key]}</span>}
            </div>
          ))}
        </div>

        <div className="form-footer-row">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading
              ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Processing…</>
              : btnLabel
            }
          </button>
          <p className="form-note">🔒 All analysis is processed securely and instantly</p>
        </div>
      </form>
    </section>
  );
}
