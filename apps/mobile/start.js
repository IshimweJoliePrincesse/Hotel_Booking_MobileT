#!/usr/bin/env node

// Patch for Windows path issue with Expo Metro config loading
const { spawn } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');

// Set up environment to patch module loading
const loaderPath = path.join(__dirname, 'loader-patch.mjs');
const nodeOptions = process.env.NODE_OPTIONS || '';
process.env.NODE_OPTIONS = `${nodeOptions} --loader ${pathToFileURL(loaderPath).href}`.trim();

// Start Expo CLI
const expo = spawn('npx', ['expo', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname,
  env: process.env
});

expo.on('error', (error) => {
  console.error(`Error starting Expo: ${error.message}`);
  process.exit(1);
});

expo.on('close', (code) => {
  process.exit(code || 0);
});
