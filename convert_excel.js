const XLSX = require('xlsx');
const fs = require('fs');

// Load the Excel file
const workbook = XLSX.readFile('bajau.csv.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const rows = XLSX.utils.sheet_to_json(sheet);

// Transform into dictionary format
const dictionary = {};
rows.forEach(row => {
  const sinama = row['Sinama']?.toLowerCase();
  if (sinama) {
    dictionary[sinama] = {
      english: row['English'] || '',
      malay: row['Malay'] || '',
      tagalog: row['Tagalog'] || ''
    };
  }
});

// Save to file
fs.writeFileSync('dictionary.json', JSON.stringify(dictionary, null, 2));
console.log('✅ dictionary.json created!');

