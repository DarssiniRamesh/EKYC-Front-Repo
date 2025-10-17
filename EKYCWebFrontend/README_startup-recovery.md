# EKYCWebFrontend Dev Server Startup Recovery

If you see "validate is not a function" during `npm start` or `npm run build`, it indicates a schema-utils/AJV mismatch in the webpack toolchain.

We pin a stable CRA5/webpack5 combo via `package.json` overrides:
- schema-utils: 3.1.2
- ajv: 8.11.0
- ajv-keywords: 5.1.0
- ajv-formats: 2.1.1
- terser-webpack-plugin: 5.3.10
- webpack: ^5.75.0
- webpack-dev-server: ^4.x

Steps to recover:
1) Remove the existing install artifacts:
   - delete `node_modules`
   - delete `package-lock.json` (if present)
2) Install dependencies:
   - `npm install --no-audit --no-fund`
3) Start server:
   - `npm start` → open http://localhost:3000

Verify:
- `npm ls schema-utils ajv ajv-keywords ajv-formats terser-webpack-plugin webpack webpack-dev-server` shows only schema-utils@3.x and terser-webpack-plugin@5.3.10.
