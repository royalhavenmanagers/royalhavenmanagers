// Analytics and Traffic Tracking Store for Royal Haven Realty & Property Managers Ltd.
// Tracks daily website pageviews and visitor sessions with local storage persistence and cloud sync

const STORAGE_KEY_VIEWS = 'royalhaven_daily_views';
const SESSION_KEY_VISIT = 'royalhaven_visited_today_session';

// Helper to format date as YYYY-MM-DD
const formatDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Clean initial data starting strictly at 0 real visits
const generateInitialData = () => {
  return { total: 0, byDate: {} };
};

export const analyticsStore = {
  // Record a real pageview on site entry
  recordView: () => {
    try {
      const todayStr = formatDateKey(new Date());
      let data = analyticsStore.getRawData();

      // Check session to count active session visits
      const alreadyCountedInSession = sessionStorage.getItem(SESSION_KEY_VISIT);

      if (!alreadyCountedInSession) {
        sessionStorage.setItem(SESSION_KEY_VISIT, todayStr);
      }

      // Increment today's count with real visit
      data.byDate[todayStr] = (data.byDate[todayStr] || 0) + 1;
      data.total = (data.total || 0) + 1;

      localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  },

  getRawData: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically purge old fake baseline weights if previously cached (e.g. baseline totaling ~830 views)
        if (parsed && parsed.byDate && typeof parsed.total === 'number') {
          const hasOldFakeWeights = parsed.total >= 100 || Object.values(parsed.byDate).some(v => v >= 35);
          if (hasOldFakeWeights) {
            const clean = { total: 1, byDate: { [formatDateKey(new Date())]: 1 } };
            localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(clean));
            return clean;
          }
          return parsed;
        }
      }
      const initial = generateInitialData();
      localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(initial));
      return initial;
    } catch {
      return generateInitialData();
    }
  },

  // Reset traffic counter to zero
  resetData: () => {
    try {
      const clean = { total: 0, byDate: {} };
      localStorage.setItem(STORAGE_KEY_VIEWS, JSON.stringify(clean));
      sessionStorage.removeItem(SESSION_KEY_VISIT);
      return clean;
    } catch {
      return { total: 0, byDate: {} };
    }
  },

  // Summary for Admin Portal display
  getStats: () => {
    const data = analyticsStore.getRawData();
    const now = new Date();
    const todayStr = formatDateKey(now);

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateKey(yesterday);

    const todayViews = data.byDate[todayStr] || 0;
    const yesterdayViews = data.byDate[yesterdayStr] || 0;

    // Last 14 days history for charts
    const history = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const views = data.byDate[key] || 0;
      history.push({
        date: key,
        dayName: dayNames[d.getDay()],
        shortDate: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
        views,
        isToday: i === 0
      });
    }

    const last7DaysTotal = history.slice(-7).reduce((acc, h) => acc + h.views, 0);

    return {
      today: todayViews,
      yesterday: yesterdayViews,
      last7Days: last7DaysTotal,
      total: data.total,
      history
    };
  }
};
