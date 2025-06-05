import { send } from 'loot-core/src/platform/client/fetch';

class AnalyticsHelper {
  constructor() {
    this.storageKey = 'analytics_activity_dates';
    this.activityData = this.loadFromStorage();
  }

  /**
   * Load existing activity data from localStorage
   * @returns {Object} Object containing activity dates
   */
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.warn('Failed to load analytics data from localStorage:', error);
      return {};
    }
  }

  /**
   * Save activity data to localStorage
   * @param {Object} data - Activity data to save
   */
  saveToStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics data to localStorage:', error);
    }
  }

  /**
   * Get today's date as a string (YYYY-MM-DD format)
   * @returns {string} Today's date
   */
  getTodaysDate() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Log an activity and update server if needed
   * @param {string} activityType - The type of activity being logged
   */
  async logActivity(activityType) {
    const today = this.getTodaysDate();
    const lastRecordedDate = this.activityData[activityType];

    // Check if this is a new activity or if the date has changed
    if (!lastRecordedDate || lastRecordedDate !== today) {
      // Update local storage
      this.activityData[activityType] = today;
      this.saveToStorage(this.activityData);

      // Make server call since date has changed
      try {
        await this.updateServerActivity(activityType, today);
        console.log(
          `Analytics: Updated server for ${activityType} on ${today}`,
        );
      } catch (error) {
        console.error(
          `Analytics: Failed to update server for ${activityType}:`,
          error,
        );
        // Optionally, you could revert the local storage change here
        // or implement a retry mechanism
      }
    } else {
      console.log(`Analytics: ${activityType} already logged for today`);
    }
  }

  /**
   * Stub function for making server calls
   * Replace this with your actual server call implementation
   * @param {string} activityType - The activity type
   * @param {string} date - The date string
   */
  async updateServerActivity(activityType, date) {
    const analyticsData = {
      last_visited_budget_small_screen: null,
      last_visited_budget_large_screen: null,
      last_changed_budgeted_amount: null,
      last_synced_account: null,
      last_interacted_with_avatar: null,
      last_edited_transaction: null,
      last_added_account: null,
      last_added_category: null,
    };

    // Set only the specific field based on activityType
    if (analyticsData.hasOwnProperty(activityType)) {
      analyticsData[activityType] = date;
    } else {
      throw new Error(`Unknown activity type: ${activityType}`);
    }

    const url = String(window.location.href);
    const results = await send('airtable-update-analytics', {
      url,
      ...analyticsData,
    });

    return results;
  }

  /**
   * Get all tracked activities and their last recorded dates
   * @returns {Object} All activity data
   */
  getAllActivities() {
    return { ...this.activityData };
  }

  /**
   * Get the last recorded date for a specific activity
   * @param {string} activityType - The activity type to check
   * @returns {string|null} The last recorded date or null if never recorded
   */
  getLastActivityDate(activityType) {
    return this.activityData[activityType] || null;
  }

  /**
   * Clear all analytics data (useful for testing or reset)
   */
  clearAllData() {
    this.activityData = {};
    this.saveToStorage(this.activityData);
    console.log('Analytics: All data cleared');
  }

  /**
   * Clear a specific activity's data
   * @param {string} activityType - The activity type to clear
   */
  clearActivity(activityType) {
    delete this.activityData[activityType];
    this.saveToStorage(this.activityData);
    console.log(`Analytics: Cleared data for ${activityType}`);
  }
}

// Export as singleton instance
const analyticsHelper = new AnalyticsHelper();
export default analyticsHelper;

// Example usage:
/*
import analyticsHelper from './AnalyticsHelper';

// In your React components or other parts of your app:
analyticsHelper.logActivity('user_login');
analyticsHelper.logActivity('page_view');
analyticsHelper.logActivity('button_click');
analyticsHelper.logActivity('form_submission');

// Check last activity date
const lastLogin = analyticsHelper.getLastActivityDate('user_login');
console.log('Last login date:', lastLogin);

// View all activities
console.log('All activities:', analyticsHelper.getAllActivities());
*/
