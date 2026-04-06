import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LINKS = [['/', 'Home'], ['/about', 'About'], ['/feedback', 'Feedback'], ['/history', 'History']];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={open ? 'navbar' : scrolled ? 'navbar scrolled' : 'navbar'}>
        <div className="nav-container">
          <NavLink to="/" className="nav-brand" onClick={close}>
            <span className="brand-icon">🍃</span>
            <span className="brand-text">Spoilage<strong>AI</strong></span>
          </NavLink>

          <ul className={open ? 'nav-links open' : 'nav-links'}>
            {LINKS.map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to} end={to === '/'}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={close}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggle}
              aria-label="Toggle dark mode"
            >
              <span className="theme-icon">{theme === 'light' ? '☀️' : '🌙'}</span>
            </button>
            <button
              type="button"
              className={open ? 'mob-toggle open' : 'mob-toggle'}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div
        className={open ? 'mob-overlay visible' : 'mob-overlay'}
        onClick={close}
        aria-hidden="true"
      />
    </>
  );
}
