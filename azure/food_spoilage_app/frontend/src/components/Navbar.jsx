import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/feedback', label: 'Feedback' },
  { to: '/history',  label: 'History'  },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`navbar${!open && scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">

          {/* Brand */}
          <NavLink to="/" className="nav-brand" onClick={close} aria-label="SpoilageAI — go home">
            <span className="brand-icon" aria-hidden="true">🍃</span>
            <span className="brand-text">Spoilage<strong>AI</strong></span>
          </NavLink>

          {/* Desktop + mobile nav links */}
          <ul className={`nav-links${open ? ' open' : ''}`} id="main-nav" role="list">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={close}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="theme-icon" aria-hidden="true">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>

            <button
              type="button"
              className={`mob-toggle${open ? ' open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="main-nav"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

        </div>
      </nav>

      {/* Overlay dims content when menu is open */}
      <div
        className={`mob-overlay${open ? ' visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
    </>
  );
}