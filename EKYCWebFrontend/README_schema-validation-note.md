# Schema validation startup fix (formatMinimum/formatMaximum)

Context:
- CRA/react-scripts@5 uses webpack 5 and performs JSON Schema validation via schema-utils.
- Some transitive dependency combinations can cause AJV keyword mismatches, yielding:
  Error: Unknown keyword "formatMinimum" (or "formatMaximum")

Root cause:
- Mismatched AJV/schema-utils/ajv-keywords versions pulled via transitive dependencies during react-scripts/webpack plugin initialization (e.g., terser-webpack-plugin) trigger validation with unsupported keywords.

Resolution applied (final):
- Pin webpack validation toolchain to a stable combo that avoids the formatMinimum/Maximum keyword path:
  - schema-utils: 2.7.1
  - ajv: 6.12.6
  - ajv-keywords: 3.5.2
  - terser-webpack-plugin: 5.3.3
  - webpack 5 via react-scripts 5
- Enforce through package.json overrides/resolutions.
- Resolutions include nested patterns (e.g., **/ajv) to catch transitive consumers reliably.
- A preinstall script runs npm-force-resolutions so the lockfile is patched before installation.

Steps to recover locally:
1) Clean install artifacts:
   rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
2) Install (preinstall will apply forced resolutions):
   npm install
3) Start dev server:
   npm start
   Visit http://localhost:3000

Notes:
- Node 18 LTS is recommended (react-scripts 5 supports Node 14/16/18).
- If issues persist, ensure that no stray ajv@8 or schema-utils@3 remain in node_modules.
- In CI environments that ignore npm "resolutions", prefer Yarn (which honors "resolutions") or keep npm-force-resolutions in preinstall as configured.
