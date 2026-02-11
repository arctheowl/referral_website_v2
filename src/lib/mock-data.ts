// Mock data utilities for demo mode (no database required)

const STORAGE_KEY = 'demo_referral_data';

export interface MockEligibility {
  session_id: string;
  parent_name: string;
  primary_email: string;
  secondary_email?: string;
  diagnosis: string;
  school_year: string;
  catchment_town: string;
  can_attend_hospital: boolean;
  submitted_at: string;
}

export interface MockUserSession {
  session_id: string;
  queue_position: number;
  status: 'waiting' | 'selected' | 'rejected' | 'completed';
  joined_at: string;
  selected_at?: string;
  completed_at?: string;
}

export interface MockCountdownTimer {
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface MockQueueStatus {
  max_users: number;
  current_users: number;
  queue_position: number;
  is_open: boolean;
}

interface MockData {
  eligibility: Record<string, MockEligibility>;
  sessions: Record<string, MockUserSession>;
  timer: MockCountdownTimer | null;
  queue: MockQueueStatus | null;
}

function getMockData(): MockData {
  if (typeof window === 'undefined') {
    return {
      eligibility: {},
      sessions: {},
      timer: null,
      queue: null
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {
        eligibility: {},
        sessions: {},
        timer: null,
        queue: null
      };
    }
  }
  
  return {
    eligibility: {},
    sessions: {},
    timer: null,
    queue: null
  };
}

function saveMockData(data: MockData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Initialize default mock data
export function initializeMockData() {
  const data = getMockData();
  
  // Always use a 20-second countdown in demo (matches waiting room default)
  const now = new Date();
  const endTime = new Date(now.getTime() + 20 * 1000);
  data.timer = {
    start_time: now.toISOString(),
    end_time: endTime.toISOString(),
    is_active: true
  };
  
  if (!data.queue) {
    data.queue = {
      max_users: 40,
      current_users: 0,
      queue_position: 0,
      is_open: true
    };
  }
  
  saveMockData(data);
  return data;
}

// Eligibility functions
export function getMockEligibility(sessionId: string): MockEligibility | null {
  const data = getMockData();
  return data.eligibility[sessionId] || null;
}

export function saveMockEligibility(sessionId: string, eligibility: Omit<MockEligibility, 'session_id' | 'submitted_at'>) {
  const data = getMockData();
  data.eligibility[sessionId] = {
    ...eligibility,
    session_id: sessionId,
    submitted_at: new Date().toISOString()
  };
  saveMockData(data);
}

// Session functions
export function getMockSession(sessionId: string): MockUserSession | null {
  const data = getMockData();
  return data.sessions[sessionId] || null;
}

export function createMockSession(sessionId: string): MockUserSession {
  const data = getMockData();
  
  if (data.sessions[sessionId]) {
    return data.sessions[sessionId];
  }
  
  const queuePosition = (data.queue?.queue_position || 0) + 1;
  const session: MockUserSession = {
    session_id: sessionId,
    queue_position: queuePosition,
    status: 'waiting',
    joined_at: new Date().toISOString()
  };
  
  data.sessions[sessionId] = session;
  
  if (data.queue) {
    data.queue.queue_position = queuePosition;
  }
  
  saveMockData(data);
  return session;
}

export function updateMockSessionStatus(sessionId: string, status: MockUserSession['status']) {
  const data = getMockData();
  if (data.sessions[sessionId]) {
    data.sessions[sessionId].status = status;
    if (status === 'selected') {
      data.sessions[sessionId].selected_at = new Date().toISOString();
    } else if (status === 'completed') {
      data.sessions[sessionId].completed_at = new Date().toISOString();
    }
    saveMockData(data);
  }
}

/** Fisher-Yates shuffle (mutates array) */
function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Randomly select up to maxUsers from all waiting sessions (demo mode).
 * Marks chosen as 'selected', rest as 'rejected'.
 */
export function runMockRandomSelection(maxUsers: number = 40): number {
  const data = getMockData();
  const waitingIds = Object.keys(data.sessions).filter(
    (id) => data.sessions[id].status === 'waiting'
  );
  shuffle(waitingIds);
  const selectedIds = new Set(waitingIds.slice(0, maxUsers));
  for (const id of waitingIds) {
    updateMockSessionStatus(id, selectedIds.has(id) ? 'selected' : 'rejected');
  }
  return selectedIds.size;
}

// Timer functions
export function getMockTimer(): MockCountdownTimer | null {
  const data = getMockData();
  return data.timer;
}

// Queue functions
export function getMockQueue(): MockQueueStatus | null {
  const data = getMockData();
  return data.queue;
}

// Demo mode: Set user status for demonstration
export function setDemoUserStatus(sessionId: string, status: MockUserSession['status']) {
  const data = getMockData();
  
  // Ensure session exists
  if (!data.sessions[sessionId]) {
    createMockSession(sessionId);
  }
  
  updateMockSessionStatus(sessionId, status);
}

// Clear all mock data
export function clearMockData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  initializeMockData();
}
