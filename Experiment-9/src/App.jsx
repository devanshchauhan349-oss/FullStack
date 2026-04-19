import { appConfig } from "./config";

const deploymentChecks = [
  "Multi-stage Docker build",
  "Runtime environment variables",
  "Nginx gzip compression",
  "Static asset caching",
  "GitHub Actions CI/CD"
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Experiment 3.2.2</p>
        <h1>{appConfig.appTitle}</h1>
        <p className="lead">
          Production build served by Nginx on port 8080 with a Docker image
          optimized for deployment.
        </p>
        <div className="meta-grid">
          <article>
            <span>Environment</span>
            <strong>{appConfig.environment}</strong>
          </article>
          <article>
            <span>API Base URL</span>
            <strong>{appConfig.apiBaseUrl}</strong>
          </article>
        </div>
      </section>

      <section className="checklist-card">
        <h2>Deployment Checklist</h2>
        <ul>
          {deploymentChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
