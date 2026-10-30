export default function Footer({ stats }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Faiyaj Jarif</span>
        <span className="mono footer-stack">Built with Spring Boot and React</span>
        {stats.visitors != null && (
          <span className="mono footer-visitors">
            <span className="live-dot" aria-hidden="true" /> {stats.visitors.toLocaleString()} visitors
          </span>
        )}
      </div>
    </footer>
  );
}
