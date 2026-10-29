const fs = require('fs');
const html = fs.readFileSync('C:/Users/Andiez/.gemini/antigravity/scratch/gym-ai-assistant/index.html', 'utf8');
const js = fs.readFileSync('C:/Users/Andiez/.gemini/antigravity/scratch/gym-ai-assistant/app.js', 'utf8');

const viewMatches = [...html.matchAll(/id=["']view-([^"']+)["']/g)].map(m => m[1]);
console.log('--- VIEWS IN HTML (' + viewMatches.length + ') ---');
console.log(Array.from(new Set(viewMatches)).sort());

const switchTabHtml = [...html.matchAll(/switchTab\(["']([^"']+)["']\)/g)].map(m => m[1]);
const switchTabJs = [...js.matchAll(/switchTab\(["']([^"']+)["']\)/g)].map(m => m[1]);
const allSwitchTabs = Array.from(new Set([...switchTabHtml, ...switchTabJs])).sort();

console.log('\n--- ALL switchTab CALLS (' + allSwitchTabs.length + ') ---');
console.log(allSwitchTabs);

const missingViews = allSwitchTabs.filter(tab => !viewMatches.includes(tab));
console.log('\n--- MISSING VIEWS FOR switchTab CALLS ---');
console.log(missingViews);
