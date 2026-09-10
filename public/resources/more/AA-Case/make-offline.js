#!/usr/bin/env node

/**
 * Make Offline Script for Objection.lol Web Exports
 *
 * This script downloads all remote custom assets and updates the assets.js and
 * project.js files to reference local copies, enabling offline playback.
 * This includes court record evidence (iconUrl / url) for case-type projects.
 *
 * Usage: node make-offline.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ASSETS_FILE = 'assets.js';
const PROJECT_FILE = 'project.js';
const CUSTOM_ASSETS_DIR = path.join('resources', 'custom');

// URL fields that may contain remote assets
const URL_FIELDS = [
  'url',
  'deskUrl',
  'blipUrl',
  'galleryImageUrl',
  'galleryAJImageUrl',
  'iconUrl',
  'idleImageUrl',
  'speakImageUrl',
  'imageUrl',
  'soundUrl',
  'fileName',
  'fontUrl',
];

console.log('========================================');
console.log('Objection.lol Offline Asset Downloader');
console.log('========================================\n');

// Check if assets.js exists
if (!fs.existsSync(ASSETS_FILE)) {
  console.error(`Error: ${ASSETS_FILE} not found!`);
  console.error(
    'Make sure you run this script from the exported project directory.',
  );
  process.exit(1);
}

// Read and parse assets.js
console.log(`Reading ${ASSETS_FILE}...`);
const assetsContent = fs.readFileSync(ASSETS_FILE, 'utf8');

// Extract the JSON by removing the window.OBJECTION_ASSETS = prefix
const jsonMatch = assetsContent.match(
  /window\.OBJECTION_ASSETS\s*=\s*({[\s\S]*});/,
);
if (!jsonMatch) {
  console.error('Error: Could not parse assets.js format');
  process.exit(1);
}

let assets;
try {
  assets = JSON.parse(jsonMatch[1]);
} catch (error) {
  console.error('Error: Failed to parse assets JSON:', error.message);
  process.exit(1);
}

// Read and parse project.js (contains court record evidence for case projects)
let project = null;
if (fs.existsSync(PROJECT_FILE)) {
  console.log(`Reading ${PROJECT_FILE}...`);
  const projectContent = fs.readFileSync(PROJECT_FILE, 'utf8');
  const projectJsonMatch = projectContent.match(
    /window\.OBJECTION_PROJECT\s*=\s*({[\s\S]*});/,
  );

  if (projectJsonMatch) {
    try {
      project = JSON.parse(projectJsonMatch[1]);
    } catch (error) {
      console.warn(
        `Warning: Failed to parse project.js JSON: ${error.message}`,
      );
    }
  }
}

// Create custom assets directory
if (!fs.existsSync(CUSTOM_ASSETS_DIR)) {
  fs.mkdirSync(CUSTOM_ASSETS_DIR, { recursive: true });
  console.log(`Created directory: ${CUSTOM_ASSETS_DIR}\n`);
}

// Find all remote URLs in the assets
const remoteAssets = new Map(); // url -> local path
let assetCounter = 0;

function isRemoteUrl(value) {
  if (typeof value !== 'string') return false;
  return value.startsWith('http://') || value.startsWith('https://');
}

function getLocalPath(remoteUrl) {
  // Reuse the same local path if we've already assigned one for this URL
  if (remoteAssets.has(remoteUrl)) {
    return remoteAssets.get(remoteUrl);
  }
  const url = new URL(remoteUrl);
  const ext = path.extname(url.pathname) || '';
  const id = ++assetCounter;
  return path.join(CUSTOM_ASSETS_DIR, `asset_${id}${ext}`);
}

function scanForRemoteAssets(obj, parentKey = '') {
  if (Array.isArray(obj)) {
    obj.forEach((item, index) =>
      scanForRemoteAssets(item, `${parentKey}[${index}]`),
    );
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (URL_FIELDS.includes(key) && isRemoteUrl(value)) {
        if (!remoteAssets.has(value)) {
          remoteAssets.set(value, getLocalPath(value));
        }
      }
      scanForRemoteAssets(value, `${parentKey}.${key}`);
    }
  }
}

console.log('Scanning for remote assets...');
scanForRemoteAssets(assets);

// Also scan the project data so that court record evidence (iconUrl / url)
// in case-type projects is included in the offline download.
if (project !== null) {
  console.log(
    'Scanning project.js for remote assets (court record evidence)...',
  );
  scanForRemoteAssets(project);
}

if (remoteAssets.size === 0) {
  console.log(
    '\n[OK] No remote assets found. This project already works offline!',
  );
  process.exit(0);
}

console.log(`\nFound ${remoteAssets.size} remote asset(s) to download.\n`);

// Download a file with progress
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    protocol
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadFile(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(
            new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`),
          );
          return;
        }

        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        fileStream.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Clean up partial file
          reject(err);
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Download all assets
async function downloadAllAssets() {
  let downloaded = 0;
  let failed = 0;
  const failedUrls = [];

  for (const [url, localPath] of remoteAssets.entries()) {
    try {
      // Skip if file already exists
      if (fs.existsSync(localPath)) {
        console.log(`[-] Skipping (exists): ${path.basename(localPath)}`);
        downloaded++;
        continue;
      }

      process.stdout.write(`[>] Downloading: ${path.basename(localPath)}...`);
      await downloadFile(url, localPath);
      downloaded++;
      console.log(' OK');
    } catch (error) {
      failed++;
      failedUrls.push({ url, error: error.message });
      console.log(` FAILED (${error.message})`);
    }
  }

  return { downloaded, failed, failedUrls };
}

// Replace remote URLs with local paths in the assets object
function replaceRemoteUrls(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceRemoteUrls(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (URL_FIELDS.includes(key) && isRemoteUrl(value)) {
        const localPath = remoteAssets.get(value);
        if (localPath) {
          // Convert to relative path with forward slashes for web
          newObj[key] = './' + localPath.replace(/\\/g, '/');
        } else {
          newObj[key] = value;
        }
      } else {
        newObj[key] = replaceRemoteUrls(value);
      }
    }
    return newObj;
  }
  return obj;
}

// Main execution
(async () => {
  try {
    const { downloaded, failed, failedUrls } = await downloadAllAssets();

    console.log('\n========================================');
    console.log(`Downloaded: ${downloaded} asset(s)`);
    if (failed > 0) {
      console.log(`Failed: ${failed} asset(s)`);
    }
    console.log('========================================\n');

    if (failedUrls.length > 0) {
      console.log('Failed downloads:');
      failedUrls.forEach(({ url, error }) => {
        console.log(`  - ${url}`);
        console.log(`    Error: ${error}`);
      });
      console.log('');
    }

    // Update assets.js with local paths
    console.log('Updating assets.js with local paths...');
    const updatedAssets = replaceRemoteUrls(assets);
    const updatedContent = `window.OBJECTION_ASSETS = ${JSON.stringify(updatedAssets, null, 2)};`;

    // Write updated file
    fs.writeFileSync(ASSETS_FILE, updatedContent, 'utf8');
    console.log(`[OK] Updated ${ASSETS_FILE}`);

    // Update project.js with local paths (court record evidence for case projects)
    if (project !== null) {
      console.log('Updating project.js with local paths...');
      const updatedProject = replaceRemoteUrls(project);
      const updatedProjectContent = `window.OBJECTION_PROJECT = ${JSON.stringify(updatedProject)};`;
      fs.writeFileSync(PROJECT_FILE, updatedProjectContent, 'utf8');
      console.log(`[OK] Updated ${PROJECT_FILE}`);
    }

    console.log('\n========================================');
    console.log('[OK] Done! Your project now works offline.');
    console.log('========================================\n');

    if (failed > 0) {
      console.log(
        'Note: Some assets failed to download. The project may not work fully offline.',
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('\n[ERROR] Fatal error:', error.message);
    process.exit(1);
  }
})();
