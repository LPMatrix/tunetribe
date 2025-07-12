import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load canvas, but provide fallback if not available
let createCanvas, loadImage, registerFont;
let canvasInitialized = false;

async function initializeCanvas() {
  if (canvasInitialized) return;
  
  try {
    const canvas = await import('canvas');
    createCanvas = canvas.default.createCanvas;
    loadImage = canvas.default.loadImage;
    registerFont = canvas.default.registerFont;
    
    // Register font (you may need to download Roboto font)
    const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');
    try {
      registerFont(fontPath, { family: 'Roboto' });
    } catch (error) {
      console.warn('Could not load Roboto font, using default font');
    }
    canvasInitialized = true;
  } catch (error) {
    console.warn('Canvas package not available, cover art generation will be disabled:', error.message);
    createCanvas = null;
    loadImage = null;
    registerFont = null;
    canvasInitialized = true;
  }
}

class CoverArtGenerator {
  constructor() {
    this.canvasSize = 640;
    this.imageSize = 320; // Each quadrant is 320x320
  }

  async downloadImage(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error(`Failed to download image from ${url}:`, error.message);
      return null;
    }
  }

  async generateCoverArt(imageUrls, playlistName = '') {
    try {
      await initializeCanvas();
      
      if (!createCanvas) {
        console.warn('Canvas not available, skipping cover art generation');
        return null;
      }
      
      const canvas = createCanvas(this.canvasSize, this.canvasSize);
      const ctx = canvas.getContext('2d');

      // Fill background with dark color
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

      // Download and process images
      const images = [];
      for (const url of imageUrls.slice(0, 4)) { // Max 4 images
        const imageBuffer = await this.downloadImage(url);
        if (imageBuffer) {
          try {
            const img = await loadImage(imageBuffer);
            images.push(img);
          } catch (error) {
            console.warn(`Failed to load image from ${url}:`, error.message);
          }
        }
      }

      if (images.length === 0) {
        // Create a simple gradient background if no images
        const gradient = ctx.createLinearGradient(0, 0, this.canvasSize, this.canvasSize);
        gradient.addColorStop(0, '#1DB954');
        gradient.addColorStop(1, '#191414');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
      } else {
        // Arrange images in a grid
        await this.arrangeImagesInGrid(ctx, images);
      }

      // Add text overlay if playlist name is provided
      if (playlistName) {
        this.addTextOverlay(ctx, playlistName);
      }

      // Convert to JPEG buffer
      return canvas.toBuffer('image/jpeg', { quality: 0.9 });
    } catch (error) {
      console.error('Error generating cover art:', error);
      throw new Error('Failed to generate cover art');
    }
  }

  async arrangeImagesInGrid(ctx, images) {
    const positions = [
      { x: 0, y: 0 },                    // Top-left
      { x: this.imageSize, y: 0 },       // Top-right
      { x: 0, y: this.imageSize },       // Bottom-left
      { x: this.imageSize, y: this.imageSize } // Bottom-right
    ];

    for (let i = 0; i < Math.min(images.length, 4); i++) {
      const img = images[i];
      const pos = positions[i];
      
      // Calculate scaling to fit the quadrant while maintaining aspect ratio
      const scale = Math.min(
        this.imageSize / img.width,
        this.imageSize / img.height
      );
      
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the image in its quadrant
      const offsetX = (this.imageSize - scaledWidth) / 2;
      const offsetY = (this.imageSize - scaledHeight) / 2;
      
      ctx.drawImage(
        img,
        pos.x + offsetX,
        pos.y + offsetY,
        scaledWidth,
        scaledHeight
      );
    }

    // If we have fewer than 4 images, fill remaining quadrants with gradient
    if (images.length < 4) {
      const gradient = ctx.createLinearGradient(0, 0, this.canvasSize, this.canvasSize);
      gradient.addColorStop(0, '#1DB954');
      gradient.addColorStop(1, '#191414');
      
      for (let i = images.length; i < 4; i++) {
        const pos = positions[i];
        ctx.fillStyle = gradient;
        ctx.fillRect(pos.x, pos.y, this.imageSize, this.imageSize);
      }
    }
  }

  addTextOverlay(ctx, text) {
    // Extract month and year from playlist name
    const monthYearMatch = text.match(/(\w+)\s+(\d{4})/);
    if (!monthYearMatch) return;

    const [, month, year] = monthYearMatch;

    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, this.canvasSize - 120, this.canvasSize, 120);

    // Set font properties
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw month
    ctx.font = 'bold 48px Roboto, Arial, sans-serif';
    ctx.fillText(month.toUpperCase(), this.canvasSize / 2, this.canvasSize - 80);

    // Draw year
    ctx.font = '32px Roboto, Arial, sans-serif';
    ctx.fillText(year, this.canvasSize / 2, this.canvasSize - 40);
  }

  async generateDefaultCoverArt(playlistName = '') {
    try {
      await initializeCanvas();
      
      if (!createCanvas) {
        console.warn('Canvas not available, skipping default cover art generation');
        return null;
      }
      
      const canvas = createCanvas(this.canvasSize, this.canvasSize);
      const ctx = canvas.getContext('2d');

      // Create Spotify-inspired gradient
      const gradient = ctx.createLinearGradient(0, 0, this.canvasSize, this.canvasSize);
      gradient.addColorStop(0, '#1DB954');
      gradient.addColorStop(0.5, '#1ed760');
      gradient.addColorStop(1, '#191414');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

      // Add musical note icon (simple representation)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = 'bold 200px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♪', this.canvasSize / 2, this.canvasSize / 2 - 30);

      // Add text overlay if provided
      if (playlistName) {
        this.addTextOverlay(ctx, playlistName);
      }

      return canvas.toBuffer('image/jpeg', { quality: 0.9 });
    } catch (error) {
      console.error('Error generating default cover art:', error);
      throw new Error('Failed to generate default cover art');
    }
  }
}

const coverArtGenerator = new CoverArtGenerator();

export const generateCoverArt = (imageUrls, playlistName) => {
  if (!imageUrls || imageUrls.length === 0) {
    return coverArtGenerator.generateDefaultCoverArt(playlistName);
  }
  return coverArtGenerator.generateCoverArt(imageUrls, playlistName);
};

export const generateDefaultCoverArt = (playlistName) => coverArtGenerator.generateDefaultCoverArt(playlistName);