#!/usr/bin/env node

/**
 * A15W - AI Agent Code Review
 * Skill extension pack for AI coding agents
 */

const path = require('path');
const fs = require('fs');

const manifestPath = path.join(__dirname, '..', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log(`
╔════════════════════════════════════════════════════════════╗
║  A15W — AI Agent Code Review v${manifest.version}                    ║
║  ${manifest.description.substring(0, 50)}...  ║
╚════════════════════════════════════════════════════════════╝

Skills: ${manifest.skills.length}
Stages: 61
Checks: 322

Location: ${path.join(__dirname, '..', 'skills')}

For AI agents: Read AGENT.md
For humans: Read README.md

Repository: ${manifest.repository.url}
`);

process.exit(0);