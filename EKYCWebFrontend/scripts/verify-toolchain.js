#!/usr/bin/env node
/**
 * Verify webpack toolchain dependency alignment for CRA5/webpack5.
 * Fails if schema-utils@2.x is present, which breaks validate() usage.
 */
const { execSync } = require('child_process');

function hasBadSchemaUtils() {
  try {
    const out = execSync('npm ls schema-utils --all --json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const data = JSON.parse(out);
    const versions = [];
    function walk(node) {
      if (!node || !node.dependencies) return;
      for (const [name, dep] of Object.entries(node.dependencies)) {
        if (name === 'schema-utils' && dep.version) {
          versions.push(dep.version);
        }
        walk(dep);
      }
    }
    walk(data);
    return versions.some(v => v.startsWith('2.'));
  } catch (e) {
    return false;
  }
}

if (hasBadSchemaUtils()) {
  console.error('\n[EKYCWebFrontend] Detected schema-utils@2.x in node_modules. This causes "validate is not a function" during CRA/webpack build.\n' +
    'Resolution: clear install artifacts and reinstall so overrides take effect:\n' +
    '  rm -rf node_modules package-lock.json && npm install --no-audit --no-fund\n');
  process.exit(1);
} else {
  console.log('[EKYCWebFrontend] Webpack toolchain check OK (schema-utils@3.x).');
}
