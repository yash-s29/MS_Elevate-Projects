import { useState } from 'react';
import Reveal from '../components/Reveal';

export default function Feedback() {
  const [form, setForm]       = useState({name:'',email:'',message:'',rating:0});
  const [errors, setErrors]   = useState({});
  const [hover, setHover]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})); };

  const validate = () => {
    const e={};
    if(form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Enter a valid email address.';
    if(!form.rating) e.rating='Please select a star rating.';
    if(!form.message.trim()) e.message='Feedback message is required.';
    return e;
  };

  const submit = ev => {
    ev.preventDefault();
    const errs=validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setDone(true); }, 900);
  };

  const Header = () => (
    <header className="page-header">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <div className="page-header-inner">
        <div className="eyebrow">💬 Your Input</div>
        <h1 className="page-title">Share Your Feedback</h1>
        <p className="page-sub">Help us improve. Your insights shape the future of SpoilageAI.</p>
      </div>
    </header>
  );

  if (done) return (
    <>
      <Header />
      <main className="main-container">
        <Reveal>
          <section className="card empty-card">
            <div className="empty-state">
              <span className="empty-icon">🎉</span>
              <h2>Thank You!</h2>
              <p>Your feedback has been received. We appreciate your time.</p>
              <button
                type="button" className="btn btn-primary btn-lg"
                onClick={()=>{ setDone(false); setForm({name:'',email:'',message:'',rating:0}); }}
              >
                Submit Another Response
              </button>
            </div>
          </section>
        </Reveal>
      </main>
    </>
  );

  return (
    <>
      <Header />
      <main className="main-container">
        <div className="feedback-layout">

          <Reveal>
            <section className="card">
              <div className="section-header">
                <span className="badge">📝 FEEDBACK FORM</span>
                <h2>We Value Your Input</h2>
                <p>Tell us what worked, what didn't, and what you'd love to see next.</p>
              </div>

              <form onSubmit={submit} noValidate style={{display:'flex',flexDirection:'column',gap:20}}>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Name <span className="optional">(optional)</span></label>
                    <div className="input-wrap">
                      <input
                        type="text" placeholder="Your name" autoComplete="name"
                        value={form.name} onChange={e=>set('name',e.target.value)}
                        style={{paddingRight:16}}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="optional">(optional)</span></label>
                    <div className="input-wrap">
                      <input
                        type="email" placeholder="your@email.com" autoComplete="email"
                        value={form.email} onChange={e=>set('email',e.target.value)}
                        className={errors.email?'error':''} style={{paddingRight:16}}
                      />
                    </div>
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="star-rating" role="group" aria-label="Star rating">
                    {[1,2,3,4,5].map(v=>(
                      <button
                        key={v} type="button"
                        className={'star'+((hover||form.rating)>=v?' active':'')}
                        onMouseEnter={()=>setHover(v)}
                        onMouseLeave={()=>setHover(0)}
                        onClick={()=>set('rating',v)}
                        aria-label={v+' star'+(v>1?'s':'')}
                        aria-pressed={form.rating===v}
                      >★</button>
                    ))}
                  </div>
                  {errors.rating && <span className="field-error">{errors.rating}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Feedback <span className="required-mark">*</span></label>
                  <div className="textarea-wrap">
                    <textarea
                      rows="5" maxLength={500}
                      placeholder="Share your thoughts, suggestions, or report an issue…"
                      value={form.message} onChange={e=>set('message',e.target.value)}
                      style={errors.message?{borderColor:'var(--danger)',boxShadow:'0 0 0 3px var(--danger-light)'}:{}}
                    />
                    <div
                      className="char-count"
                      style={{color:form.message.length>450?'var(--danger)':''}}
                    >
                      {form.message.length} / 500
                    </div>
                  </div>
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <div className="form-footer-row">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading
                      ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…</>
                      : 'Send Feedback'
                    }
                  </button>
                  <p className="form-note">Your input helps us build better tools 💚</p>
                </div>

              </form>
            </section>
          </Reveal>

          <Reveal delay={100}>
            <aside className="feedback-aside">
              <div className="aside-card">
                <h3>What to share?</h3>
                <ul className="aside-list">
                  {['Accuracy of predictions','UI / usability suggestions','New food items to add','Bugs or broken features','General impressions'].map(item=>(
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="aside-card">
                <h3>Privacy</h3>
                <p>Your name and email are optional and will never be shared. Feedback is used solely to improve this project.</p>
              </div>
            </aside>
          </Reveal>

        </div>
      </main>
    </>
  );
}
