const toIsoDate = (date) => date.toISOString().slice(0, 10);

const nextWeekday = (weekday) => {
  const today = new Date();
  const result = new Date(today);
  const distance = (weekday - today.getDay() + 7) % 7 || 7;
  result.setDate(today.getDate() + distance);
  return toIsoDate(result);
};

/**
 * Small offline fallback so the interaction form stays usable if the local API
 * is stopped during a demo. The backend remains the source of truth whenever
 * it is reachable.
 */
export const extractInteractionLocally = (message) => {
  const now = new Date();
  const nameMatch = message.match(/(?:met|name is|i'm|i am)\s+(Dr\.?\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const specialtyMatch = message.match(/\b(cardiologist|oncologist|neurologist|endocrinologist|gastroenterologist|rheumatologist)\b/i);
  const hospitalMatch = message.match(/(?:at|working at)\s+([A-Z][A-Za-z .,&-]+?)(?:[,.]|\s+my\s+|\s+please|$)/i);
  const timeMatch = message.match(/\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  const productMatch = message.match(/(?:interested in|discussed)\s+(.+?)(?:[.!]|$)/i);
  const materialMatch = message.match(/shared\s+(.+?)(?:[.!]|$)/i);
  const lowered = message.toLowerCase();

  let meetingDate = toIsoDate(now);
  if (lowered.includes('next tuesday')) meetingDate = nextWeekday(2);
  else if (lowered.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    meetingDate = toIsoDate(tomorrow);
  }

  let meetingTime = now.toTimeString().slice(0, 5);
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minutes = timeMatch[2] || '00';
    if (timeMatch[3].toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (timeMatch[3].toLowerCase() === 'am' && hour === 12) hour = 0;
    meetingTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  }

  const products = productMatch
    ? productMatch[1].split(/,|\band\b/i).map((item) => item.trim()).filter(Boolean)
    : [];

  return {
    hcp_name: nameMatch ? `${nameMatch[1] ? 'Dr. ' : ''}${nameMatch[2]}`.trim() : undefined,
    hospital: hospitalMatch?.[1]?.trim(),
    specialization: specialtyMatch?.[1]
      ? `${specialtyMatch[1][0].toUpperCase()}${specialtyMatch[1].slice(1).toLowerCase()}`
      : undefined,
    interaction_type: 'Meeting',
    date: meetingDate,
    time: meetingTime,
    topics_discussed: message.trim(),
    products_discussed: products,
    materials_shared: materialMatch
      ? materialMatch[1].split(/,|\band\b/i).map((item) => item.trim()).filter(Boolean)
      : [],
  };
};
