const ACTIVE_TRACKER_KEY = "expense_tracker_active_tracker";

export const setActiveTracker = (tracker) => {
  localStorage.setItem(ACTIVE_TRACKER_KEY, JSON.stringify(tracker));
};

export const getActiveTracker = () => {
  const tracker = localStorage.getItem(ACTIVE_TRACKER_KEY);
  return tracker ? JSON.parse(tracker) : null;
};

export const clearActiveTracker = () => {
  localStorage.removeItem(ACTIVE_TRACKER_KEY);
};