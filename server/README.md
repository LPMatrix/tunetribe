## Features

- **Telegram Bot Integration**: Automatically monitors Telegram chat for Spotify links
- **Spotify API Integration**: Creates playlists, manages tracks, and handles OAuth authentication
- **Automated Playlist Creation**: Generates monthly playlists from community-shared tracks
- **Cover Art Generation**: Creates custom playlist cover art from album artwork
- **RESTful API**: Provides endpoints for the Vue.js frontend
- **Scheduled Tasks**: Automated monthly playlist creation and weekly summaries
- **Real-time Processing**: Processes Spotify links as they're shared in Telegram

## Prerequisites

- Node.js 16+ and npm
- Telegram Bot Token
- Spotify Developer Account
- Canvas dependencies for cover art generation

### Canvas Dependencies

For cover art generation, you may need to install system dependencies:

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

## Setup

### 1. Environment Configuration

Copy the environment template and fill in your credentials:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_USER_ID=your_spotify_user_id_here
SPOTIFY_REDIRECT_URI=http://localhost:3001/api/auth/spotify/callback

# Server Configuration
PORT=3001
ENV=development
```

### 2. Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add the bot to your group/channel
4. Get the chat ID using [@userinfobot](https://t.me/userinfobot)

#### Webhook vs Polling Configuration

The bot supports two modes:

**Development (Polling Mode)**:
- Uses long polling to receive updates
- Suitable for local development
- Default when `ENV=development`

**Production (Webhook Mode)**:
- Uses webhooks for better performance and reliability
- Required for most production deployments
- Activated when `ENV=production` or `USE_WEBHOOK=true`

For production deployment, add these environment variables:
```env
ENV=production
WEBHOOK_URL=https://your-domain.com
```

### 3. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3001/api/auth/spotify/callback`
4. Note your Client ID and Client Secret
5. Get your Spotify User ID from your profile

### 4. Install Dependencies

```bash
npm install
```


## API Endpoints

### Authentication

- `GET /api/auth/spotify/authorize` - Get Spotify authorization URL
- `POST /api/auth/spotify/callback` - Handle OAuth callback
- `GET /api/auth/spotify/status` - Check authorization status
- `POST /api/auth/spotify/refresh` - Refresh access token
- `POST /api/auth/spotify/revoke` - Revoke authorization

### Playlists

- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get specific playlist
- `POST /api/playlists/:id/tracks` - Add tracks to playlist
- `GET /api/playlists/search/tracks` - Search for tracks

### Telegram Integration

- `GET /api/playlists/telegram/messages` - Get Telegram messages
- `GET /api/playlists/telegram/spotify-links` - Get Spotify links from messages
- `POST /api/telegram/webhook` - Telegram webhook endpoint (production only)

### Tracks

- `GET /api/playlists/tracks/:id` - Get track details
- `POST /api/playlists/tracks/batch` - Get multiple track details

## Authorization Flow

1. **Get Authorization URL**:
   ```bash
   curl http://localhost:3001/api/auth/spotify/authorize
   ```

2. **Visit the returned URL** and authorize the application

3. **The callback will be handled automatically** and tokens will be stored

4. **Check status**:
   ```bash
   curl http://localhost:3001/api/auth/spotify/status
   ```

## Scheduled Tasks

The server includes automated scheduling:

- **Monthly Playlist Creation**: Runs on the 1st of each month at 9:00 AM UTC
- **Weekly Summary**: Runs every Sunday at 6:00 PM UTC

Scheduled tasks are enabled in production mode or when `ENABLE_SCHEDULER=true` is set.

## Data Storage

The server stores data in JSON files:

- `data/spotify_tokens.json` - Spotify OAuth tokens
- `data/messages.json` - Telegram message history

## Error Handling

The server includes comprehensive error handling:

- Spotify API rate limiting
- Token refresh automation
- Telegram bot reconnection
- Graceful shutdown handling

## Deployment

### Production Deployment

1. **Set Environment Variables**:
   ```env
   ENV=production
   WEBHOOK_URL=https://your-domain.com
   VITE_API_BASE_URL=https://your-domain.com/api
   FRONTEND_URL=https://your-domain.com
   SPOTIFY_REDIRECT_URI=https://your-domain.com/api/auth/spotify/callback
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_USER_ID=your_spotify_user_id
   ```

2. **Deploy to your hosting platform** (Heroku, Railway, DigitalOcean, etc.)

3. **The webhook will be automatically configured** when the server starts

