// Wrapper to handle Windows path issues with Node 22
const path = require('path');
const { pathToFileURL } = require('url');

// Convert Windows path to file:// URL
const configPath = path.join(__dirname, 'metro.config.js');
const fileUrl = pathToFileURL(configPath).href;

// Dynamically import the config
(async () => {
  try {
    const config = await import(fileUrl);
    module.exports = config.default || config;
  } catch (error) {
    console.error('Error loading metro config:', error);
    // Fallback to require
    module.exports = require('./metro.config.js');
  }
})();
