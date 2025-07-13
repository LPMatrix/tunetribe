import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeTelegramBot } from './services/telegram.js';
import { initializeScheduler } from './services/scheduler.js';
import playlistRoutes from './routes/playlists.js';
import authRoutes from './routes/auth.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve Vue app for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Handle other non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Initialize services
async function startServer() {
  try {
    console.log('🚀 Starting TuneTribe server...');
    
    // Initialize Telegram bot
    await initializeTelegramBot();
    console.log('✅ Telegram bot initialized');
    
    // Initialize scheduler
    initializeScheduler();
    console.log('✅ Scheduler initialized');
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`📱 API available at http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer();