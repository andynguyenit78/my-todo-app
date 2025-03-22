import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themes = [
  {
    name: 'default',
    pattern: `
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    `
  },
  {
    name: 'nature',
    pattern: `
      <defs>
        <pattern id="leaves" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="15" fill="currentColor" opacity="0.1"/>
          <path d="M30 15 Q 45 30 30 45 Q 15 30 30 15" fill="currentColor" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#dcfce7"/>
      <rect width="100%" height="100%" fill="url(#leaves)"/>
    `
  },
  {
    name: 'abstract',
    pattern: `
      <defs>
        <pattern id="waves" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 0 20 Q 20 40 40 20 Q 60 0 80 20 T 120 20" stroke="currentColor" fill="none" stroke-width="2" opacity="0.1"/>
          <path d="M 0 60 Q 20 80 40 60 Q 60 40 80 60 T 120 60" stroke="currentColor" fill="none" stroke-width="2" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#e0f2fe"/>
      <rect width="100%" height="100%" fill="url(#waves)"/>
    `
  },
  {
    name: 'geometric',
    pattern: `
      <defs>
        <pattern id="hexagons" width="60" height="104" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 17.3 L60 51.9 L30 69.2 L0 51.9 L0 17.3 Z" fill="currentColor" opacity="0.1"/>
          <path d="M30 104 L60 86.7 L60 52.1 L30 34.8 L0 52.1 L0 86.7 Z" fill="currentColor" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#fae8ff"/>
      <rect width="100%" height="100%" fill="url(#hexagons)"/>
    `
  }
];

const generateSVG = (name, pattern) => `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  ${pattern}
</svg>
`;

// Ensure directories exist
const themesDir = path.join(__dirname, '../public/themes');
const musicDir = path.join(__dirname, '../public/music');

if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
}

// Generate theme images
themes.forEach(theme => {
  const svg = generateSVG(theme.name, theme.pattern);
  fs.writeFileSync(path.join(themesDir, `${theme.name}.svg`), svg);
});

// Create empty music files
const tracks = ['lofi.mp3', 'ambient.mp3', 'piano.mp3'];
tracks.forEach(track => {
  fs.writeFileSync(path.join(musicDir, track), '');
}); 