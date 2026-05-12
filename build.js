#!/usr/bin/env node
/**
 * build.js — single command to build everything
 * Usage: node build.js
 *
 * Runs in order:
 *   1. inject-seo.js   → meta tags, sitemap, robots
 *   2. patch-pwa.js    → manifest, SW, install banner, iOS meta
 */

const { execSync } = require('child_process');
const path = require('path');

function run(script) {
  console.log(`\n▶  ${script}`);
  execSync(`node ${path.join(__dirname, script)}`, { stdio: 'inherit' });
}

try {
  run('inject-seo.js');
  run('patch-pwa.js');
  console.log('\n✓  Build complete. Deploy these files to your root:');
  console.log('   lap-timer.html (rename to index.html on server)');
  console.log('   manifest.json');
  console.log('   sw.js');
  console.log('   sitemap.xml');
  console.log('   robots.txt');
  console.log('   icons/          ← generate with: node generate-icons.js');
} catch (e) {
  console.error('\n✗  Build failed:', e.message);
  process.exit(1);
}
