# TuneTribe Server

Node.js backend server for TuneTribe - A collaborative music discovery platform that integrates Telegram bot functionality with Spotify playlist management.

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

## Running the Server

### Development Mode

```bash
# Run server only
npm run server:dev

# Run both frontend and backend
npm run dev:full
```

### Production Mode

```bash
# Build and start
npm start

# Or run server only
npm run server
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
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   # ... other variables
   ```

2. **Deploy to your hosting platform** (Heroku, Railway, DigitalOcean, etc.)

3. **The webhook will be automatically configured** when the server starts

### Troubleshooting Deployment Issues

#### Telegram Error: 409 Conflict

If you encounter `TelegramError: ETELEGRAM: 409 Conflict: terminated by other getUpdates request`, this means multiple bot instances are running:

**Solution 1: Clear existing webhooks**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

**Solution 2: Stop all local instances**
- Ensure no local development servers are running
- Check for background processes

**Solution 3: Force webhook mode**
```env
USE_WEBHOOK=true
WEBHOOK_URL=https://your-domain.com
```

#### Common Issues

- **Webhook not receiving updates**: Ensure your domain is accessible and uses HTTPS
- **Bot not responding**: Check that `TELEGRAM_CHAT_ID` matches your group/channel
- **Spotify authentication fails**: Verify redirect URI matches your deployment URL

## Development

### Project Structure

```
server/
├── index.js              # Main server file
├── routes/
│   ├── auth.js          # Authentication routes
│   └── playlists.js     # Playlist management routes
├── services/
│   ├── spotify-auth.js  # Spotify OAuth handling
│   ├── spotify.js       # Spotify API integration
│   ├── telegram.js      # Telegram bot service
│   ├── cover-art.js     # Cover art generation
│   └── scheduler.js     # Scheduled tasks
├── assets/
│   └── fonts/           # Fonts for cover art
├── data/                # JSON data storage
└── .env                 # Environment configuration
```

### Adding New Features

1. **New API Endpoints**: Add routes in `routes/` directory
2. **New Services**: Create services in `services/` directory
3. **New Scheduled Tasks**: Add to `services/scheduler.js`
4. **Database Integration**: Replace JSON storage with database

## Troubleshooting

### Common Issues

1. **Canvas Installation Errors**:
   - Install system dependencies for your OS
   - Use Node.js 16+ for better Canvas compatibility

2. **Telegram Bot Not Responding**:
   - Check bot token and chat ID
   - Ensure bot is added to the group
   - Verify network connectivity

3. **Spotify Authorization Fails**:
   - Check client ID and secret
   - Verify redirect URI matches exactly
   - Ensure app is not in development mode restrictions

4. **Server Won't Start**:
   - Check port availability
   - Verify all environment variables are set
   - Check Node.js version compatibility

### Logs

The server provides detailed logging:

- 🚀 Server startup
- 🤖 Telegram bot events
- 🎵 Spotify API calls
- 📅 Scheduled task execution
- ❌ Error details

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Keep dependencies updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.