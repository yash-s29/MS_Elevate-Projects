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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className={'navbar' + (scrolled ? ' scrolled' : '')}>
        <div className="nav-container">
          <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
            <span className="brand-icon">&#x1F343;</span>
            <span className="brand-text">Spoilage<strong>AI</strong></span>
          </NavLink>

          <ul className={'nav-links' + (open ? ' open' : '')}>
            {LINKS.map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to} end={to === '/'}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setOpen(false)}
                >{label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
              <span className="theme-icon">{theme === 'light' ? '☀️' : '🌙'}</span>
            </button>
            <button
              className={'mob-toggle' + (open ? ' open' : '')}
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={'mob-overlay' + (open ? ' visible' : '')} onClick={() => setOpen(false)} />
    </>
  );
}
