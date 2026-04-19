# React Docker Multi-Stage Build and CI/CD

This project demonstrates a production-oriented React deployment using:

- React 18 with Vite
- Docker multi-stage builds
- Nginx on port `8080`
- Runtime environment injection
- GitHub Actions CI/CD
- GitHub Container Registry publishing
- Slack deployment notifications

## Local development

```bash
npm install
npm run dev
```

## Runtime environment variables

The container replaces values in `env-config.template.js` at startup, so you can
change deployment values without rebuilding the image.

Supported variables:

- `API_BASE_URL`
- `APP_TITLE`
- `APP_ENV`

Use them inside the app through `window.__APP_CONFIG__` via [`src/config.js`](src/config.js).

## Build Docker image

```bash
docker build -t react-docker-app .
```

## Run Docker container

```bash
docker run --rm -p 8080:8080 ^
  -e API_BASE_URL=https://api.example.com ^
  -e APP_TITLE="Production React App" ^
  -e APP_ENV=production ^
  react-docker-app
```

Open `http://localhost:8080`.

## Expected production behavior

- Small runtime image based on `nginx:alpine`
- Static assets cached for one year with `immutable`
- `index.html` served for SPA routes
- Gzip enabled for text-based assets
- `env-config.js` not cached

## GitHub Actions setup

Add these repository secrets:

- `SLACK_WEBHOOK_URL` for deployment notifications

The workflow will:

1. Run tests on pull requests to `main`
2. Build the app on pull requests and pushes
3. Build and push the Docker image to `ghcr.io/<owner>/<repo>` on pushes to `main`
4. Tag images with both `latest` and the short commit SHA

## Notes

- The Docker build uses `npm ci`, so keep `package-lock.json` committed after running `npm install`.
- If you want GitHub Packages visibility controls, configure the package settings in the repository after the first push.
