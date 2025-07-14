# TuneTribe

TuneTribe - A collaborative music discovery platform that integrates Telegram bot functionality with Spotify playlist management.

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

##  Current State vs Original Vision
What Works : ✅ Telegram monitoring, ✅ Spotify integration, ✅ Monthly automation, ✅ Web interface

What's Missing : ❌ Multi-company support, ❌ Self-service bot setup, ❌ Company-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.