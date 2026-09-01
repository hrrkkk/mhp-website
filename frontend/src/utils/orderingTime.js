/**
 * Utility for checking ordering time window in India Standard Time (IST, UTC+5:30).
 * Standard ordering window: 09:30 AM to 10:30 AM.
 */

export const getISTCurrentMinutes = () => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    const parts = formatter.formatToParts(now);
    let hour = 0;
    let minute = 0;
    for (const part of parts) {
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }
    if (hour === 24) hour = 0;
    return hour * 60 + minute;
  } catch (e) {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
};

/**
 * Checks if ordering is permitted based on API slot status or local IST time (9:30 AM - 10:30 AM).
 * @param {Object|null} slotData - Data returned from GET /api/ordering-slot
 * @returns {boolean} true if ordering is allowed, false otherwise.
 */
export const isOrderingTimeOpen = (slotData = null) => {
  if (slotData && typeof slotData.isOpen === 'boolean') {
    return slotData.isOpen;
  }
  // Default window: 9:30 AM (570 mins) to 10:30 AM (630 mins) IST
  const currentMins = getISTCurrentMinutes();
  const startMins = 9 * 60 + 30; // 09:30 AM
  const endMins = 10 * 60 + 30;   // 10:30 AM
  return currentMins >= startMins && currentMins < endMins;
};

/**
 * Gets human readable ordering window text.
 */
export const getOrderingTimeWindowText = (slotData = null) => {
  if (slotData && slotData.orderingWindow) {
    return slotData.orderingWindow;
  }
  return '9:30 AM – 10:30 AM';
};
