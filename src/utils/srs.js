/**
 * FlashForge — SM-2 Spaced Repetition Algorithm
 * 
 * Implementation of the SM-2 algorithm with Anki-style modifications.
 * Each card tracks: state, interval, easeFactor, repetitions, lapses, due date.
 */

// ── Card States ───────────────────────────────────────────────
export const CardState = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  RELEARNING: 'relearning',
};

// ── Rating Values ─────────────────────────────────────────────
export const Rating = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
};

// ── Default Preset ────────────────────────────────────────────
export const DEFAULT_PRESET = {
  newCardsPerDay: 20,
  maxReviewsPerDay: 200,
  learningSteps: [1, 10],           // minutes
  graduatingInterval: 1,            // days
  easyInterval: 4,                  // days
  startingEase: 2.5,
  easyBonus: 1.3,
  intervalModifier: 1.0,
  maxInterval: 36500,               // ~100 years
  relearningSteps: [10],            // minutes
  minInterval: 1,                   // days
  leechThreshold: 8,
  leechAction: 'suspend',           // 'suspend' | 'tag'
};

// ── Helpers ───────────────────────────────────────────────────

/**
 * Convert minutes to a human-readable interval string.
 */
export function formatInterval(minutes) {
  if (minutes < 1) return '< 1m';
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  const days = Math.round(minutes / 1440);
  if (days < 30) return `${days}d`;
  if (days < 365) return `${(days / 30).toFixed(1)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

/**
 * Add minutes to a date, returning a new Date.
 */
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Add days to a date, returning a new Date.
 */
function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Clamp ease factor to minimum of 1.3.
 */
function clampEase(ease) {
  return Math.max(1.3, ease);
}

// ── Core Algorithm ────────────────────────────────────────────

/**
 * Schedule a card based on the user's rating.
 * Returns a new card object with updated SRS fields.
 * 
 * @param {Object} card - The card to schedule
 * @param {number} rating - Rating.AGAIN | Rating.HARD | Rating.GOOD | Rating.EASY
 * @param {Object} preset - Deck preset with scheduling parameters
 * @returns {Object} Updated card with new due date, interval, ease, etc.
 */
export function scheduleCard(card, rating, preset = DEFAULT_PRESET) {
  const now = new Date();
  const updated = { ...card };

  switch (card.state) {
    case CardState.NEW:
    case CardState.LEARNING:
      return scheduleLearning(updated, rating, preset, now);

    case CardState.REVIEW:
      return scheduleReview(updated, rating, preset, now);

    case CardState.RELEARNING:
      return scheduleRelearning(updated, rating, preset, now);

    default:
      return scheduleLearning(updated, rating, preset, now);
  }
}

/**
 * Handle cards in NEW or LEARNING state.
 */
function scheduleLearning(card, rating, preset, now) {
  const steps = preset.learningSteps;
  const currentStep = card.learningStep || 0;

  if (rating === Rating.AGAIN) {
    // Reset to first step
    card.learningStep = 0;
    card.state = CardState.LEARNING;
    card.due = addMinutes(now, steps[0] || 1).toISOString();
  } else if (rating === Rating.HARD) {
    // Stay at current step (or average of current and next)
    card.state = CardState.LEARNING;
    const stepMinutes = steps[currentStep] || steps[steps.length - 1] || 1;
    card.due = addMinutes(now, stepMinutes).toISOString();
  } else if (rating === Rating.GOOD) {
    // Advance to next step
    const nextStep = currentStep + 1;
    if (nextStep >= steps.length) {
      // Graduate!
      card.state = CardState.REVIEW;
      card.intervalDays = preset.graduatingInterval;
      card.easeFactor = preset.startingEase;
      card.repetitions = 1;
      card.learningStep = 0;
      card.due = addDays(now, preset.graduatingInterval).toISOString();
    } else {
      card.learningStep = nextStep;
      card.state = CardState.LEARNING;
      card.due = addMinutes(now, steps[nextStep]).toISOString();
    }
  } else if (rating === Rating.EASY) {
    // Graduate immediately with easy interval
    card.state = CardState.REVIEW;
    card.intervalDays = preset.easyInterval;
    card.easeFactor = preset.startingEase;
    card.repetitions = 1;
    card.learningStep = 0;
    card.due = addDays(now, preset.easyInterval).toISOString();
  }

  return card;
}

/**
 * Handle cards in REVIEW state.
 */
function scheduleReview(card, rating, preset, now) {
  const currentInterval = card.intervalDays || 1;

  if (rating === Rating.AGAIN) {
    // Lapse! Move to relearning
    card.lapses = (card.lapses || 0) + 1;
    card.state = CardState.RELEARNING;
    card.learningStep = 0;
    card.easeFactor = clampEase(card.easeFactor - 0.20);
    card.repetitions = 0;

    const relearningStep = preset.relearningSteps[0] || 10;
    card.due = addMinutes(now, relearningStep).toISOString();

    // Check leech
    if (card.lapses >= preset.leechThreshold) {
      if (preset.leechAction === 'suspend') {
        card.suspended = true;
      }
      card.isLeech = true;
    }
  } else if (rating === Rating.HARD) {
    // Smaller interval increase, ease decrease
    const newInterval = Math.max(
      currentInterval + 1,
      currentInterval * 1.2 * preset.intervalModifier
    );
    card.intervalDays = Math.min(Math.round(newInterval), preset.maxInterval);
    card.easeFactor = clampEase(card.easeFactor - 0.15);
    card.repetitions += 1;
    card.state = CardState.REVIEW;
    card.due = addDays(now, card.intervalDays).toISOString();
  } else if (rating === Rating.GOOD) {
    // Normal interval increase
    const newInterval = currentInterval * card.easeFactor * preset.intervalModifier;
    card.intervalDays = Math.min(Math.round(newInterval), preset.maxInterval);
    card.repetitions += 1;
    card.state = CardState.REVIEW;
    card.due = addDays(now, card.intervalDays).toISOString();
  } else if (rating === Rating.EASY) {
    // Large interval increase, ease increase
    const newInterval = currentInterval * card.easeFactor * preset.easyBonus * preset.intervalModifier;
    card.intervalDays = Math.min(Math.round(newInterval), preset.maxInterval);
    card.easeFactor = card.easeFactor + 0.15;
    card.repetitions += 1;
    card.state = CardState.REVIEW;
    card.due = addDays(now, card.intervalDays).toISOString();
  }

  return card;
}

/**
 * Handle cards in RELEARNING state (lapsed review cards).
 */
function scheduleRelearning(card, rating, preset, now) {
  const steps = preset.relearningSteps;
  const currentStep = card.learningStep || 0;

  if (rating === Rating.AGAIN) {
    // Reset to first relearning step
    card.learningStep = 0;
    card.due = addMinutes(now, steps[0] || 10).toISOString();
  } else if (rating === Rating.HARD) {
    // Stay at current step
    const stepMinutes = steps[currentStep] || steps[steps.length - 1] || 10;
    card.due = addMinutes(now, stepMinutes).toISOString();
  } else if (rating === Rating.GOOD) {
    // Advance to next step
    const nextStep = currentStep + 1;
    if (nextStep >= steps.length) {
      // Graduate back to review
      card.state = CardState.REVIEW;
      card.intervalDays = Math.max(preset.minInterval, Math.round(card.intervalDays * 0.7));
      card.learningStep = 0;
      card.due = addDays(now, card.intervalDays).toISOString();
    } else {
      card.learningStep = nextStep;
      card.due = addMinutes(now, steps[nextStep]).toISOString();
    }
  } else if (rating === Rating.EASY) {
    // Graduate immediately with a decent interval
    card.state = CardState.REVIEW;
    card.intervalDays = Math.max(preset.minInterval, card.intervalDays);
    card.easeFactor = card.easeFactor + 0.15;
    card.learningStep = 0;
    card.due = addDays(now, card.intervalDays).toISOString();
  }

  return card;
}

// ── Query Functions ───────────────────────────────────────────

/**
 * Calculate what each rating button would produce for display.
 * Returns the interval strings shown on each button.
 */
export function calculateNextIntervals(card, preset = DEFAULT_PRESET) {
  const results = {};

  for (const [name, value] of Object.entries(Rating)) {
    const simulated = scheduleCard({ ...card }, value, preset);
    const now = new Date();
    const due = new Date(simulated.due);
    const diffMinutes = (due - now) / (1000 * 60);
    results[name.toLowerCase()] = formatInterval(diffMinutes);
  }

  return results;
}

/**
 * Get cards that are due for study from a list.
 * Returns categorized and limited cards.
 */
export function getDueCards(cards, preset = DEFAULT_PRESET) {
  const now = new Date();

  // Filter out suspended and buried
  const active = cards.filter(c => !c.suspended && !c.buried);

  // Categorize
  const newCards = active.filter(c => c.state === CardState.NEW);
  const learningCards = active.filter(c =>
    (c.state === CardState.LEARNING || c.state === CardState.RELEARNING) &&
    new Date(c.due) <= now
  );
  const reviewCards = active.filter(c =>
    c.state === CardState.REVIEW &&
    new Date(c.due) <= now
  );

  // Apply daily limits
  const limitedNew = newCards.slice(0, preset.newCardsPerDay);
  const limitedReview = reviewCards.slice(0, preset.maxReviewsPerDay);

  // Build study queue: learning first, then interleave new and review
  const queue = [
    ...learningCards,
    ...interleave(limitedNew, limitedReview),
  ];

  return {
    queue,
    counts: {
      new: limitedNew.length,
      learning: learningCards.length,
      review: limitedReview.length,
    },
    totals: {
      new: newCards.length,
      learning: learningCards.length,
      review: reviewCards.length,
    }
  };
}

/**
 * Interleave two arrays evenly.
 */
function interleave(a, b) {
  const result = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

/**
 * Create a new card with default SRS values.
 */
export function createNewCard(noteId, cardOrdinal = 0) {
  return {
    id: crypto.randomUUID(),
    noteId,
    cardOrdinal,
    state: CardState.NEW,
    due: new Date().toISOString(),
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
    learningStep: 0,
    suspended: false,
    buried: false,
    flagColor: null,
    isLeech: false,
  };
}
