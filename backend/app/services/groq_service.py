// Local, offline fallback for extracting interaction details from a chat message
// when the backend /chat endpoint cannot be reached. Mirrors the shape produced
// by the backend's Groq extraction so applyExtractedData() can map it the same way.

function extractDoctorName(message) {
  let match = message.match(/\bDr\.?\s+([A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+)*)/);
  if (match) return `Dr. ${match[1].trim()}`;
  match = message.match(/(?:doctor|hcp)\s+([A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+)*)/i);
  if (match) return match[1].trim();
  return null;
}

function extractHospital(message) {
  const match = message.match(/at\s+([A-Za-z][A-Za-z0-9 .&'-]+?)(?:\.|,| on | for | next| today| yesterday)/);
  return match ? match[1].trim() : null;
}

function extractMeetingType(message) {
  const lowered = message.toLowerCase();
  if (lowered.includes('conference')) return 'Conference';
  if (lowered.includes('email')) return 'Email';
  if (lowered.includes('call')) return 'Call';
  if (lowered.includes('meeting')) return 'Meeting';
  return 'Other';
}

function extractMeetingDate(message) {
  const lowered = message.toLowerCase();
  const today = new Date();

  if (lowered.includes('today')) return today.toISOString().slice(0, 10);
  if (lowered.includes('yesterday')) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  if (lowered.includes('tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  const isoMatch = message.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  return today.toISOString().slice(0, 10);
}

function extractMeetingTime(message) {
  const match = message.match(/\b(\d{1,2}:\d{2})\s*(am|pm|AM|PM)?\b/);
  if (!match) return null;
  let [, time, meridian] = match;
  if (!meridian) return time;

  let [hours, minutes] = time.split(':').map(Number);
  meridian = meridian.toLowerCase();
  if (meridian === 'pm' && hours < 12) hours += 12;
  if (meridian === 'am' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function extractProductsDiscussed(message) {
  const match = message.match(/discussed\s+([A-Z][A-Za-z0-9+.\- ]+?)(?:\s+today|\s+at|\.|,|$)/);
  if (!match) return [];
  return [match[1].trim()];
}

function extractMaterialsShared(message) {
  const match = message.match(/(?:send|shared?)\s+(.+?)(?:\.\s|\.|$)/i);
  if (!match) return [];
  return match[1]
    .split(/\s+and\s+|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// FIX: sentiment detection (previously missing / not wired up)
function extractSentiment(message) {
  const lowered = message.toLowerCase();
  const positiveHints = ['good result', 'positive', 'interested', 'satisfied', 'impressed', 'great'];
  const negativeHints = ['negative', 'concern', 'not interested', 'declined', 'price is', 'too expensive', 'high cost'];

  const hasPositive = positiveHints.some((hint) => lowered.includes(hint));
  const hasNegative = negativeHints.some((hint) => lowered.includes(hint));

  if (hasPositive && hasNegative) return 'Neutral';
  if (hasPositive) return 'Positive';
  if (hasNegative) return 'Negative';
  return 'Neutral';
}

// FIX: outcomes detection (previously missing / not wired up)
function extractOutcomes(message) {
  const match = message.match(/(?:results?|outcome|response)[^.]*\./i);
  return match ? match[0].trim() : null;
}

// FIX: follow-up actions detection (previously missing / not wired up)
function extractFollowUpActions(message) {
  const lowered = message.toLowerCase();
  const actions = [];

  if (lowered.includes('send') || lowered.includes('please send')) {
    const sendMatch = message.match(/send\s+(?:the\s+)?(.+?)(?:\.\s|\.|$)/i);
    actions.push(sendMatch ? `Send ${sendMatch[1].trim()}` : 'Send requested materials');
  }
  if (lowered.includes('schedule') || lowered.includes("let's schedule") || lowered.includes('follow-up meeting') || lowered.includes('follow up meeting')) {
    actions.push('Schedule follow-up meeting');
  }
  if (lowered.includes('follow-up') || lowered.includes('follow up')) {
    if (!actions.some((a) => a.toLowerCase().includes('schedule'))) {
      actions.push('Confirm next follow-up action');
    }
  }

  return actions;
}

function extractFollowUpDate(message) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const lowered = message.toLowerCase();
  const dayMatch = dayNames.find((day) => lowered.includes(day));
  if (!dayMatch) return null;

  const today = new Date();
  const targetDay = dayNames.indexOf(dayMatch);
  const currentDay = today.getDay();
  let diff = targetDay - currentDay;
  if (diff <= 0) diff += 7;
  if (lowered.includes('next')) diff += 7;

  const result = new Date(today);
  result.setDate(result.getDate() + diff);
  return result.toISOString().slice(0, 10);
}

export function extractInteractionLocally(message) {
  const doctorName = extractDoctorName(message);
  const hospital = extractHospital(message);

  return {
    doctor_name: doctorName,
    hospital,
    specialization: null,
    meeting_date: extractMeetingDate(message),
    meeting_time: extractMeetingTime(message),
    interaction_type: extractMeetingType(message),
    attendees: [],
    products_discussed: extractProductsDiscussed(message),
    discussion_summary: message.trim(),
    materials_shared: extractMaterialsShared(message),
    samples_distributed: [],
    hcp_sentiment: extractSentiment(message),
    outcomes: extractOutcomes(message),
    follow_up_actions: extractFollowUpActions(message),
    follow_up_date: extractFollowUpDate(message),
    priority: /urgent|critical|asap/i.test(message) ? 'High' : 'Medium',
    next_action: null,
  };
}