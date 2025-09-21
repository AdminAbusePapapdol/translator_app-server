const fs = require('fs');
const path = require('path');

const csv = fs.readFileSync(path.join(__dirname, 'bajau.csv'), 'utf8');
const lines = csv.trim().split('\n');
const headers = lines[0].split(',');

const json = {};

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  const sinama = values[0].trim().toLowerCase();

  json[sinama] = {
    english: values[1]?.trim(),
    malay: values[2]?.trim(),
    tagalog: values[3]?.trim()
  };
}

fs.writeFileSync('dictionary.json', JSON.stringify(json, null, 2));
console.log('✅ dictionary.json created!');
