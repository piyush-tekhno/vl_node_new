import axios from 'axios';

const API_BASE_URL = 'http://20.235.242.228:2005/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can get the token from your auth context or async storage
    const token = ''; // This will be set dynamically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Visitor {
  log_id: number;
  user_id: number;
  dept_id: number;
  visitor_name: string;
  email: string;
  mobile_no: string;
  city: string;
  reason: string;
  visit_date: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
  tbl_visitor_logscol: string | null;
}

export interface VisitorStats {
  success: boolean;
  message: string;
  data: {
    count: number;
    list: Visitor[];
  };
  statusCode: number;
  accessToken: string;
}

export interface DashboardStats {
  today: number;
  week: number;
  month: number;
  year: number;
  todayData: Visitor[];
  weekData: Visitor[];
  monthData: Visitor[];
  yearData: Visitor[];
}

class VisitorService {
  async getVisitorStats(type: 'day' | 'week' | 'month' | 'year', date: string, token?: string): Promise<VisitorStats> {
    try {
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {};

      const response = await apiClient.get(`/visitors/dashboard`, {
        params: { type, value: date },
        ...config
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      throw error;
    }
  }

  async getDashboardCounts(token?: string): Promise<DashboardStats> {
    try {
      const currentDate = new Date();
      
      // Today's date in YYYY-MM-DD format
      const today = currentDate.toISOString().split('T')[0];
      
      // Current week - using today's date for week calculation
      const weekDate = today;
      
      // Current month in YYYY-MM format
      const month = today.substring(0, 7);
      
      // Current year
      const year = today.substring(0, 4);

      // Make all API calls concurrently
      const [todayStats, weekStats, monthStats, yearStats] = await Promise.all([
        this.getVisitorStats('day', today, token),
        this.getVisitorStats('week', weekDate, token),
        this.getVisitorStats('month', month, token),
        this.getVisitorStats('year', year, token)
      ]);

      return {
        today: todayStats.data.count,
        week: weekStats.data.count,
        month: monthStats.data.count,
        year: yearStats.data.count,
        todayData: todayStats.data.list,
        weekData: weekStats.data.list,
        monthData: monthStats.data.list,
        yearData: yearStats.data.list
      };
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
      // Return default values in case of error
      return {
        today: 0,
        week: 0,
        month: 0,
        year: 0,
        todayData: [],
        weekData: [],
        monthData: [],
        yearData: []
      };
    }
  }

  // Helper method to get visitor data for a specific period
  async getVisitorData(period: 'today' | 'week' | 'month' | 'year', token?: string): Promise<Visitor[]> {
    const currentDate = new Date();
    let type: 'day' | 'week' | 'month' | 'year' = 'day';
    let value = '';

    switch (period) {
      case 'today':
        type = 'day';
        value = currentDate.toISOString().split('T')[0];
        break;
      case 'week':
        type = 'week';
        value = currentDate.toISOString().split('T')[0];
        break;
      case 'month':
        type = 'month';
        value = currentDate.toISOString().split('T')[0].substring(0, 7);
        break;
      case 'year':
        type = 'year';
        value = currentDate.toISOString().split('T')[0].substring(0, 4);
        break;
    }

    try {
      const stats = await this.getVisitorStats(type, value, token);
      return stats.data.list;
    } catch (error) {
      console.error(`Error fetching ${period} data:`, error);
      return [];
    }
  }
}

export const visitorService = new VisitorService();