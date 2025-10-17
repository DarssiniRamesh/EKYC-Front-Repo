# Schema validation startup fix

Context:
- CRA/react-scripts@5 uses webpack 5 and validates options via schema-utils.
- A “validate is not a function” or “Unknown keyword formatMinimum/formatMaximum” typically indicates an AJV/schema-utils mismatch across transitive plugins (e.g., terser-webpack-plugin, loaders).

Root cause:
- schema-utils v2 (AJV v6) forced globally conflicts with plugins that expect schema-utils v3 (AJV v8) which exposes the validate() helper and supports newer keywords.

Resolution applied (final):
- Align to a stable CRA5/webpack5 toolchain using schema-utils v3 and AJV v8:
  - schema-utils: 3.3.0
  - ajv: 8.12.0
  - ajv-keywords: 5.1.0
  - ajv-formats: 2.1.1
  - terser-webpack-plugin: 5.3.10
  - webpack: ^5.75.0
  - webpack-dev-server: ^4.x
- Enforced via package.json "overrides".
- Removed npm-force-resolutions preinstall hook to avoid down-pinning to schema-utils v2/AJV v6.

Steps to recover locally:
1) Clean install artifacts:
   rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
2) Install:
   npm install
3) Start dev server:
   npm start
   Visit http://localhost:3000

Notes:
- Node 18 LTS is recommended (react-scripts 5 supports Node 14/16/18).
- If issues persist, run: npm ls schema-utils ajv ajv-keywords ajv-formats terser-webpack-plugin webpack webpack-dev-server
- Ensure only one major of schema-utils is present (v3.x).
