import TelegramBot from 'node-telegram-bot-api';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import spotifyService from './spotify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TelegramService {
  constructor() {
    this.messagesFile = path.join(__dirname, '../../data/messages.json');
    this.bot = null;
    this.messageStorage = {
      messages: [],
      lastProcessed: null
    };
  }

  async initializeBot() {
    // Get environment variables at initialization time (after dotenv has loaded)
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!this.token || this.token === 'your_telegram_bot_token_here') {
      console.warn('⚠️  TELEGRAM_BOT_TOKEN is not set or using placeholder value. Telegram bot will be disabled.');
      return;
    }

    if (!this.chatId || this.chatId === 'your_telegram_chat_id_here') {
      console.warn('⚠️  TELEGRAM_CHAT_ID is not set or using placeholder value. Telegram bot will be disabled.');
      return;
    }

    this.bot = new TelegramBot(this.token, { polling: true });
    
    // Load existing messages
    await this.loadMessages();
    
    // Set up message handlers
    this.setupMessageHandlers();
    
    console.log('🤖 Telegram bot initialized and listening for messages');
  }

  setupMessageHandlers() {
    // Handle text messages
    this.bot.on('message', async (msg) => {
      try {
        if (msg.chat.id.toString() !== this.chatId) {
          console.log(`Ignoring message from unauthorized chat: ${msg.chat.id}`);
          return;
        }

        await this.processMessage(msg);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle errors
    this.bot.on('error', (error) => {
      console.error('Telegram bot error:', error);
    });

    // Handle polling errors
    this.bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error);
    });
  }

  async processMessage(msg) {
    const messageData = {
      id: msg.message_id,
      text: msg.text || '',
      date: new Date(msg.date * 1000).toISOString(),
      from: {
        id: msg.from?.id,
        username: msg.from?.username,
        first_name: msg.from?.first_name,
        last_name: msg.from?.last_name
      },
      chat: {
        id: msg.chat.id,
        type: msg.chat.type
      }
    };

    // Check for Spotify links
    const spotifyLinks = this.extractSpotifyLinks(msg.text || '');
    if (spotifyLinks.length > 0) {
      messageData.spotify_links = spotifyLinks;
      console.log(`📱 Found ${spotifyLinks.length} Spotify link(s) in message from ${msg.from?.first_name}`);
    }

    // Store message if it's new
    if (!this.isDuplicateMessage(messageData)) {
      this.messageStorage.messages.push(messageData);
      await this.saveMessages();
      
      // Send acknowledgment for Spotify links
      if (spotifyLinks.length > 0) {
        await this.sendMessage(`🎵 Thanks for sharing! Found ${spotifyLinks.length} Spotify track(s).`);
      }
    }
  }

  extractSpotifyLinks(text) {
    const spotifyRegex = /https?:\/\/(?:open\.)?spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)(?:\?[^\s]*)?/g;
    const links = [];
    let match;

    while ((match = spotifyRegex.exec(text)) !== null) {
      links.push({
        url: match[0],
        type: match[1],
        id: match[2]
      });
    }

    return links;
  }

  isDuplicateMessage(newMessage) {
    return this.messageStorage.messages.some(msg => 
      msg.id === newMessage.id && 
      msg.chat.id === newMessage.chat.id
    );
  }

  async loadMessages() {
    try {
      const dataDir = path.dirname(this.messagesFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      const data = await fs.readFile(this.messagesFile, 'utf8');
      this.messageStorage = JSON.parse(data);
      
      if (!this.messageStorage.messages) {
        this.messageStorage.messages = [];
      }
      
      console.log(`📚 Loaded ${this.messageStorage.messages.length} stored messages`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📚 No existing messages file found, starting fresh');
        this.messageStorage = { messages: [], lastProcessed: null };
      } else {
        console.error('Error loading messages:', error);
        throw error;
      }
    }
  }

  async saveMessages() {
    try {
      const dataDir = path.dirname(this.messagesFile);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.messagesFile, JSON.stringify(this.messageStorage, null, 2));
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  }

  async sendMessage(text, options = {}) {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }
      
      return await this.bot.sendMessage(this.chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessagesInDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.messageStorage.messages.filter(msg => {
      const msgDate = new Date(msg.date);
      return msgDate >= start && msgDate <= end;
    });
  }

  async getSpotifyLinksInDateRange(startDate, endDate) {
    const messages = await this.getMessagesInDateRange(startDate, endDate);
    const spotifyLinks = [];
    
    messages.forEach(msg => {
      if (msg.spotify_links && msg.spotify_links.length > 0) {
        msg.spotify_links.forEach(link => {
          spotifyLinks.push({
            ...link,
            message_date: msg.date,
            from: msg.from
          });
        });
      }
    });
    
    return spotifyLinks;
  }

  async createMonthlyPlaylist(year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      
      console.log(`🎵 Creating playlist for ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
      
      const spotifyLinks = await this.getSpotifyLinksInDateRange(startDate, endDate);
      
      if (spotifyLinks.length === 0) {
        console.log('No Spotify tracks found for this period');
        return null;
      }
      
      // Extract track IDs and get track details
      const trackIds = spotifyLinks
        .filter(link => link.type === 'track')
        .map(link => link.id);
      
      if (trackIds.length === 0) {
        console.log('No Spotify tracks found for this period');
        return null;
      }
      
      const tracks = await spotifyService.getTracksDetails(trackIds);
      const trackUris = tracks.map(track => track.uri);
      
      // Get album art for cover generation
      const albumImages = tracks
        .map(track => track.album.images[0]?.url)
        .filter(url => url)
        .slice(0, 4); // Max 4 images for cover art
      
      const monthName = startDate.toLocaleDateString('en-US', { month: 'long' });
      const playlistName = `TuneTribe - ${monthName} ${year}`;
      const description = `Curated tracks from TuneTribe community for ${monthName} ${year}. ${tracks.length} tracks discovered together.`;
      
      const playlist = await spotifyService.createPlaylistWithTracks(
        playlistName,
        trackUris,
        description,
        albumImages
      );
      
      // Send notification to Telegram
      await this.sendMessage(
        `🎉 Monthly playlist created!\n\n` +
        `📀 **${playlistName}**\n` +
        `🎵 ${tracks.length} tracks\n` +
        `🔗 [Listen on Spotify](${playlist.external_urls.spotify})`
      );
      
      return playlist;
    } catch (error) {
      console.error('Error creating monthly playlist:', error);
      throw error;
    }
  }

  getStoredMessages() {
    return this.messageStorage.messages;
  }

  getMessageStats() {
    const messages = this.messageStorage.messages;
    const totalMessages = messages.length;
    const messagesWithSpotify = messages.filter(msg => msg.spotify_links && msg.spotify_links.length > 0).length;
    const totalSpotifyLinks = messages.reduce((sum, msg) => sum + (msg.spotify_links?.length || 0), 0);
    
    return {
      totalMessages,
      messagesWithSpotify,
      totalSpotifyLinks,
      lastProcessed: this.messageStorage.lastProcessed
    };
  }
}

const telegramService = new TelegramService();

export const initializeTelegramBot = () => telegramService.initializeBot();
export { telegramService };