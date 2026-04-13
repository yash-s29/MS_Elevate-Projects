import { useState } from 'react';
import Reveal from '../components/Reveal';

const BASE = 'http://127.0.0.1:5000';

const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const WHY = [
  { icon: '📊', text: 'Improves prediction accuracy' },
  { icon: '🚀', text: 'Helps prioritize new features'  },
  { icon: '🧠', text: 'Enhances user experience'       },
  { icon: '🔒', text: 'Stored securely & privately'    },
];

function PageHeader() {
  return (
    <header className="page-header">
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="page-header-inner">
        <div className="eyebrow">💬 Feedback</div>
        <h1 className="page-title">We Value Your Opinion</h1>
        <p className="page-sub">
          Your feedback directly improves SpoilageAI's accuracy and experience.
        </p>
      </div>
    </header>
  );
}

export default function Feedback() {
  const [form, setForm]     = useState({ name: '', email: '', message: '', rating: null });
  const [errors, setErrors] = useState({});
  const [hover, setHover]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.rating)         e.rating  = 'Please select a rating.';
    if (!form.message.trim()) e.message = 'Feedback message is required.';
    return e;
  };

  const submit = async ev => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerMsg('');
    try {
      const payload = {
        name:    form.name.trim(),
        email:   form.email.trim(),
        rating:  Number(form.rating),
        message: form.message.trim(),
      };
      const res  = await fetch(`${BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setDone(true);
      setForm({ name: '', email: '', message: '', rating: null });
    } catch (err) {
      setServerMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Success state */
  if (done) return (
    <>
      <PageHeader />
      <main className="main-container">
        <Reveal>
          <div className="card empty-card">
            <div className="empty-state">
              <span className="empty-icon">🎉</span>
              <h2>Feedback Submitted!</h2>
              <p>We appreciate your input. It helps us build a better product for everyone.</p>
              <button className="btn btn-primary btn-lg" onClick={() => setDone(false)}>
                Submit More Feedback
              </button>
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );

  return (
    <>
      <PageHeader />

      <main className="main-container">
        <div className="feedback-layout">

          {/* ── FORM ──────────────────────────────────────────── */}
          <Reveal>
            <section className="card">
              <div className="section-header">
                <span className="badge">📝 USER FEEDBACK</span>
                <h2>Share Your Experience</h2>
                <p>All fields are required. Takes less than 30 seconds.</p>
              </div>

              {serverMsg && (
                <div className="status-message error" role="alert" style={{ marginBottom: '20px' }}>
                  ❌ {serverMsg}
                </div>
              )}

              <form onSubmit={submit} noValidate>

                {/* Name */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" htmlFor="fb-name">Full Name</label>
                  <input
                    id="fb-name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={errors.name ? 'error' : ''}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" htmlFor="fb-email">Email Address</label>
                  <input
                    id="fb-email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
                </div>

                {/* Star rating */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" id="rating-label">Rate Your Experience</label>
                  <div className="star-rating" role="group" aria-labelledby="rating-label">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`star${(hover || form.rating) >= v ? ' active' : ''}`}
                        onMouseEnter={() => setHover(v)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => set('rating', v)}
                        aria-label={`${v} — ${STAR_LABELS[v]}`}
                        aria-pressed={form.rating === v}
                      >
                        ★
                      </button>
                    ))}
                    {(hover || form.rating) > 0 && (
                      <span className="star-label" aria-live="polite">
                        {STAR_LABELS[hover || form.rating]}
                      </span>
                    )}
                  </div>
                  {errors.rating && <span className="field-error" role="alert">{errors.rating}</span>}
                </div>

                {/* Message */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="fb-message">Your Feedback</label>
                  <textarea
                    id="fb-message"
                    rows={5}
                    placeholder="What did you like? What can we improve?"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className={errors.message ? 'error' : ''}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <span className="field-error" role="alert">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? '⏳ Sending…' : '✉️ Submit Feedback'}
                </button>

              </form>
            </section>
          </Reveal>

          {/* ── SIDEBAR ───────────────────────────────────────── */}
          <Reveal delay={80}>
            <aside className="feedback-info">

              <div className="aside-card">
                <h3>Why This Matters</h3>
                <ul className="feedback-why">
                  {WHY.map(({ icon, text }) => (
                    <li key={text}>
                      <span className="why-icon" aria-hidden="true">{icon}</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="aside-card">
                <h3>🔒 Privacy First</h3>
                <p style={{ fontSize: '.87rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  Your feedback is stored securely and used only to improve SpoilageAI.
                  We never share your information with third parties.
                </p>
              </div>

            </aside>
          </Reveal>

        </div>
      </main>
    </>
  );
}