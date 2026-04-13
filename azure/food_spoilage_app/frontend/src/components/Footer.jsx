export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-top">
          <div className="footer-logo">
            <span aria-hidden="true">🍃</span>
            SpoilageAI
          </div>
          <p className="footer-tagline">Smarter storage. Less waste. Better future.</p>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} SpoilageAI &nbsp;·&nbsp; Sustainability Through Technology
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}