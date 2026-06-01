// Workaround for Windows path issue with Expo on Node 22
const { spawn } = require('child_process');
const path = require('path');

// Set NODE_OPTIONS to use legacy module resolution
process.env.NODE_OPTIONS = '--no-experimental-fetch';

// Start Expo
const expo = spawn('npx', ['expo', 'start'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

expo.on('error', (error) => {
  console.error(`Error starting Expo: ${error.message}`);
  process.exit(1);
});

expo.on('close', (code) => {
  process.exit(code);
});
