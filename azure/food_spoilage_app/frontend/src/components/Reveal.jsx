import { useEffect, useRef } from 'react';

export default function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    const t = setTimeout(() => obs.observe(el), delay);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [delay]);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: delay ? delay + 'ms' : undefined, ...style }}>
      {children}
    </div>
  );
}
