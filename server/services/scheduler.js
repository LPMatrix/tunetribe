import cron from 'node-cron';
import { telegramService } from './telegram.js';

class SchedulerService {
  constructor() {
    this.jobs = new Map();
  }

  // Schedule monthly playlist creation (runs on the 1st of each month at 9:00 AM)
  scheduleMonthlyPlaylistCreation() {
    const cronExpression = '0 9 1 * *'; // At 09:00 on day-of-month 1
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        console.log('🕘 Running scheduled monthly playlist creation...');
        
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const year = lastMonth.getFullYear();
        const month = lastMonth.getMonth() + 1; // getMonth() returns 0-11
        
        console.log(`Creating playlist for ${year}-${month.toString().padStart(2, '0')}`);
        
        const playlist = await telegramService.createMonthlyPlaylist(year, month);
        
        if (playlist) {
          console.log(`Successfully created monthly playlist: ${playlist.name}`);
        } else {
          console.log('No tracks found for monthly playlist creation');
        }
      } catch (error) {
        console.error('Error in scheduled monthly playlist creation:', error);
      }
    }, {
      scheduled: false, // Don't start immediately
      timezone: 'UTC'
    });
    
    this.jobs.set('monthlyPlaylist', job);
    console.log('Monthly playlist creation scheduled for 1st of each month at 9:00 AM UTC');
    
    return job;
  }

  // Schedule weekly summary (runs every Sunday at 6:00 PM)
  scheduleWeeklySummary() {
    const cronExpression = '0 18 * * 0'; // At 18:00 on Sunday
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        console.log('🕕 Running scheduled weekly summary...');
        
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const spotifyLinks = await telegramService.getSpotifyLinksInDateRange(weekAgo, now);
        
        if (spotifyLinks.length > 0) {
          const contributors = {};
          spotifyLinks.forEach(link => {
            const name = link.from.first_name || link.from.username || 'Unknown';
            contributors[name] = (contributors[name] || 0) + 1;
          });
          
          const topContributors = Object.entries(contributors)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => `${name}: ${count} track${count > 1 ? 's' : ''}`);
          
          const message = `📊 **Weekly Music Summary**\n\n` +
            `🎵 ${spotifyLinks.length} tracks shared this week\n` +
            `👥 ${Object.keys(contributors).length} contributors\n\n` +
            `🏆 **Top Contributors:**\n${topContributors.join('\n')}`;
          
          await telegramService.sendMessage(message);
          console.log('Weekly summary sent');
        } else {
          console.log('No tracks shared this week, skipping summary');
        }
      } catch (error) {
        console.error('Error in scheduled weekly summary:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });
    
    this.jobs.set('weeklySummary', job);
    console.log('Weekly summary scheduled for Sundays at 6:00 PM UTC');
    
    return job;
  }

  // Start all scheduled jobs
  startAll() {
    console.log('Starting all scheduled jobs...');
    
    this.jobs.forEach((job, name) => {
      job.start();
      console.log(`Started job: ${name}`);
    });
  }

  // Stop all scheduled jobs
  stopAll() {
    console.log('🛑 Stopping all scheduled jobs...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`🛑 Stopped job: ${name}`);
    });
  }

  // Start specific job
  startJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.start();
      console.log(`Started job: ${jobName}`);
      return true;
    }
    console.warn(`Job not found: ${jobName}`);
    return false;
  }

  // Stop specific job
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      console.log(`🛑 Stopped job: ${jobName}`);
      return true;
    }
    console.warn(`Job not found: ${jobName}`);
    return false;
  }

  // Get job status
  getJobStatus(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      return {
        name: jobName,
        running: job.running || false
      };
    }
    return null;
  }

  // Get all jobs status
  getAllJobsStatus() {
    const status = {};
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running || false
      };
    });
    return status;
  }

  // Initialize all scheduled jobs
  initialize() {
    console.log('Initializing scheduler service...');
    
    this.scheduleMonthlyPlaylistCreation();
    this.scheduleWeeklySummary();
    
    // Start jobs if in production or if explicitly enabled
    if (process.env.ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
      this.startAll();
    } else {
      console.log('Scheduler jobs created but not started (development mode)');
      console.log('Set ENABLE_SCHEDULER=true to start jobs in development');
    }
  }

  // Manual trigger for monthly playlist (for testing)
  async triggerMonthlyPlaylist(year, month) {
    try {
      console.log(`🎵 Manually triggering monthly playlist creation for ${year}-${month}`);
      const playlist = await telegramService.createMonthlyPlaylist(year, month);
      return playlist;
    } catch (error) {
      console.error('Error in manual monthly playlist trigger:', error);
      throw error;
    }
  }

  // Manual trigger for weekly summary (for testing)
  async triggerWeeklySummary() {
    try {
      console.log('📊 Manually triggering weekly summary');
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const spotifyLinks = await telegramService.getSpotifyLinksInDateRange(weekAgo, now);
      
      if (spotifyLinks.length === 0) {
        return { message: 'No tracks shared this week' };
      }
      
      const contributors = {};
      spotifyLinks.forEach(link => {
        const name = link.from.first_name || link.from.username || 'Unknown';
        contributors[name] = (contributors[name] || 0) + 1;
      });
      
      return {
        totalTracks: spotifyLinks.length,
        contributors: Object.keys(contributors).length,
        topContributors: Object.entries(contributors)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
      };
    } catch (error) {
      console.error('Error in manual weekly summary trigger:', error);
      throw error;
    }
  }
}

const schedulerService = new SchedulerService();

export { schedulerService };
export const initializeScheduler = () => schedulerService.initialize();