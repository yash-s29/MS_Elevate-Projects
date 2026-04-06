import { useEffect, useRef } from 'react';

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );
    const t = setTimeout(() => obs.observe(el), delay);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [delay]);
  return (
    <div
      ref={ref}
      className="reveal"
      style={delay ? { transitionDelay: delay + 'ms' } : undefined}
    >
      {children}
    </div>
  );
}
