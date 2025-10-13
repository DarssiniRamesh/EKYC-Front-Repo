# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Epic 126321 - Cypress E2E

Initial failing tests have been added to drive TDD for Registration & Authentication (mobile/email OTP, password creation, login, validation).

Scripts:
- npm run test:e2e (interactive)
- npm run test:e2e:headless (CI-friendly)

See TESTING_Epic126321_Cypress.md for details and required data-test attributes in UI components.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Backend API configuration

The frontend uses a configurable API base URL for live (non-test) requests.

Precedence:
1. window.__ENV__.API_BASE_URL (injected at runtime)
2. REACT_APP_API_BASE_URL (build-time env, e.g., in .env)
3. Fallback: http://localhost:3001

File: src/config/api.ts exports:
- API_BASE_URL
- apiFetch(path, init) -> wraps fetch and prefixes API_BASE_URL
- pingHealth() -> pings /health or / to verify connectivity

Example .env (do not commit secrets):
REACT_APP_API_BASE_URL=http://localhost:3001

You can also inject at runtime (e.g., in index.html before bundle):
<script>
  window.__ENV__ = { API_BASE_URL: 'https://api.example.com' };
</script>

Connectivity check:
- On app start, Router logs a health check of the backend to the browser console, showing the API_BASE_URL and status.

CORS:
- Ensure the backend at http://localhost:3001 allows CORS from the frontend origin (http://localhost:3000 during dev).
- Example Express CORS (in backend):
  const cors = require('cors');
  app.use(cors({ origin: '*', credentials: false }));
  // Or restrict to specific origin: origin: 'http://localhost:3000'
