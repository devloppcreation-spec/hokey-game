import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactsDir = 'C:\\Users\\saada\\.gemini\\antigravity\\brain\\83f9861f-da8b-42a9-8f97-d432e9430755';
const assetsDir = 'C:\\Users\\saada\\.gemini\\antigravity\\scratch\\hockey-game\\public\\assets\\balls';

// Make sure target dir exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Map generated filename to desired target filename
const files = [
  { source: 'hockey_puck_1773470751535.png', target: 'hockey.png' },
  { source: 'soccer_ball_1773470764170.png', target: 'soccer.png' },
  { source: 'basketball_asset_1773470779970.png', target: 'basketball.png' },
  { source: 'tennis_ball_1773470871806.png', target: 'tennis.png' },
  { source: 'volleyball_asset_1773470893739.png', target: 'volleyball.png' }
];

async function processImages() {
  for (const file of files) {
    const sourcePath = path.join(artifactsDir, file.source);
    const targetPath = path.join(assetsDir, file.target);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`Source not found: ${sourcePath}`);
      continue;
    }
    
    try {
      const img = await loadImage(sourcePath);
      // DALL-E images are usually 1024x1024
      const size = img.width;
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw as a circular mask to remove white background
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
      ctx.clip();
      
      ctx.drawImage(img, 0, 0, size, size);
      
      // Write to file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(targetPath, buffer);
      console.log(`Successfully extracted and saved: ${file.target}`);
    } catch (e) {
      console.error(`Error processing ${file.source}:`, e);
    }
  }
}

processImages();
