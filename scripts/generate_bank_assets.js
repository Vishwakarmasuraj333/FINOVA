const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'assets', 'payments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
  'hdfc-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#004C8F"/>
  <rect x="22" y="22" width="56" height="56" rx="6" fill="none" stroke="#ED1C24" stroke-width="10"/>
  <rect x="43" y="22" width="14" height="56" fill="#FFFFFF"/>
  <rect x="22" y="43" width="56" height="14" fill="#FFFFFF"/>
  <rect x="43" y="43" width="14" height="14" fill="#004C8F"/>
</svg>`,

  'icici-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#053C6D"/>
  <circle cx="50" cy="50" r="38" fill="#B02A30"/>
  <circle cx="50" cy="50" r="28" fill="none" stroke="#F37021" stroke-width="6"/>
  <circle cx="50" cy="35" r="5" fill="#FFFFFF"/>
  <rect x="46" y="44" width="8" height="22" rx="3" fill="#FFFFFF"/>
</svg>`,

  'sbi-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#0091DA"/>
  <circle cx="50" cy="50" r="36" fill="#FFFFFF"/>
  <circle cx="50" cy="50" r="28" fill="#0091DA"/>
  <circle cx="50" cy="44" r="8" fill="#FFFFFF"/>
  <rect x="46" y="44" width="8" height="26" fill="#FFFFFF"/>
</svg>`,

  'kotak-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#EE1C25"/>
  <path d="M30 50 C22 36, 40 26, 50 36 C58 44, 62 56, 70 48 C76 42, 70 30, 62 34 C54 38, 46 54, 38 62 C28 70, 20 58, 30 50 Z" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="64" cy="40" r="4" fill="#003366"/>
</svg>`,

  'pnb-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#A20034"/>
  <circle cx="50" cy="50" r="34" fill="#FFCC00"/>
  <circle cx="50" cy="50" r="24" fill="#A20034"/>
  <text x="50" y=\"57\" font-family=\"sans-serif\" font-weight=\"900\" font-size=\"20\" fill=\"#FFCC00\" text-anchor=\"middle\">PNB</text>
</svg>`,

  'indusind-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#841A1C"/>
  <circle cx="50" cy="50" r="36" fill="none" stroke="#C59B27" stroke-width="4"/>
  <text x="50" y="47" font-family="sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle">INDUS</text>
  <text x="50" y="63" font-family="sans-serif" font-weight="900" font-size="14" fill="#C59B27" text-anchor="middle">IND</text>
</svg>`,

  'yes-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#002B49"/>
  <rect x="18" y="28" width="64" height="44" rx="8" fill="#ED1C24"/>
  <text x="50" y="58" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">YES</text>
</svg>`,

  'idfc-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#991B1E"/>
  <text x="50" y="46" font-family="sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">IDFC</text>
  <text x="50" y="64" font-family="sans-serif" font-weight="700" font-size="11" fill="#E5B25D" text-anchor="middle">FIRST</text>
</svg>`,

  'federal-bank.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#004B87"/>
  <circle cx="50" cy="50" r="34" fill="#FFC20E"/>
  <text x="50" y="57" font-family="sans-serif" font-weight="900" font-size="13" fill="#004B87" text-anchor="middle">FEDERAL</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(dir, filename), content.trim());
  console.log(`Generated: ${filename}`);
}
console.log('All bank SVGs generated successfully.');
