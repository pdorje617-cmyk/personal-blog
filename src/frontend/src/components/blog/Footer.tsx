export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-sans">
          © {year}. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground font-sans">
          Built with{" "}
          <span aria-hidden="true" className="highlight-accent">
            ♥
          </span>{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-150 underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
