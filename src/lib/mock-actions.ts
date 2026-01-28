"use server";

// Mock server actions for demo mode (no database required)
// These functions mirror the real actions but use localStorage via client-side utilities

import { isDemoMode } from "./config";

// Note: Since these are server actions but we need client-side localStorage,
// we'll return a special flag that tells the client to use mock data
export async function getCountdownTimer() {
  if (!isDemoMode()) {
    throw new Error("getCountdownTimer should not be called in demo mode");
  }
  return { _mock: true, type: 'countdown_timer' };
}

export async function getQueueStatus() {
  if (!isDemoMode()) {
    throw new Error("getQueueStatus should not be called in demo mode");
  }
  return { _mock: true, type: 'queue_status' };
}

export async function createUserSession(sessionId: string) {
  if (!isDemoMode()) {
    throw new Error("createUserSession should not be called in demo mode");
  }
  return { _mock: true, type: 'create_session', sessionId };
}

export async function getUserSession(sessionId: string) {
  if (!isDemoMode()) {
    throw new Error("getUserSession should not be called in demo mode");
  }
  return { _mock: true, type: 'get_session', sessionId };
}

export async function selectUsersForReferral() {
  if (!isDemoMode()) {
    throw new Error("selectUsersForReferral should not be called in demo mode");
  }
  return { _mock: true, type: 'select_users' };
}

export async function submitEligibilityCheck(sessionId: string, eligibilityData: { schoolYear: string; catchmentTown: string; canAttendHospital: boolean }) {
  if (!isDemoMode()) {
    throw new Error("submitEligibilityCheck should not be called in demo mode");
  }
  return { _mock: true, type: 'eligibility', sessionId, eligibilityData };
}

export async function checkEligibilityStatus(sessionId: string) {
  if (!isDemoMode()) {
    throw new Error("checkEligibilityStatus should not be called in demo mode");
  }
  return { _mock: true, type: 'check_eligibility', sessionId };
}

export async function submitReferralForm(sessionId: string, formData: Record<string, any>) {
  if (!isDemoMode()) {
    throw new Error("submitReferralForm should not be called in demo mode");
  }
  return { _mock: true, type: 'submit_form', sessionId, formData };
}

export async function checkFormSubmissionStatus(sessionId: string) {
  if (!isDemoMode()) {
    throw new Error("checkFormSubmissionStatus should not be called in demo mode");
  }
  return { _mock: true, type: 'check_submission', sessionId };
}

export async function addToWaitlist(sessionId: string, waitlistData: Record<string, any>) {
  if (!isDemoMode()) {
    throw new Error("addToWaitlist should not be called in demo mode");
  }
  return { _mock: true, type: 'waitlist', sessionId, waitlistData };
}
