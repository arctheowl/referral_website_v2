"use client";

// Client-side hooks for demo mode that use mock data instead of server actions
import { useEffect, useState } from "react";
import { isDemoMode } from "./config";
import {
  getMockEligibility,
  saveMockEligibility,
  getMockSession,
  createMockSession,
  updateMockSessionStatus,
  getMockTimer,
  getMockQueue,
  initializeMockData,
  type MockUserSession,
  type MockCountdownTimer,
  type MockQueueStatus,
  type MockEligibility
} from "./mock-data";

// Initialize mock data on load
if (typeof window !== 'undefined' && isDemoMode()) {
  initializeMockData();
}

export function useDemoEligibility(sessionId: string) {
  const [eligibility, setEligibility] = useState<MockEligibility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDemoMode() || !sessionId) {
      setLoading(false);
      return;
    }

    const check = getMockEligibility(sessionId);
    setEligibility(check);
    setLoading(false);
  }, [sessionId]);

  const submitEligibility = async (data: { schoolYear: string; catchmentTown: string; canAttendHospital: boolean }) => {
    if (!isDemoMode() || !sessionId) return { success: false, error: "Invalid session" };
    
    saveMockEligibility(sessionId, data);
    setEligibility(getMockEligibility(sessionId));
    return { success: true };
  };

  return { eligibility, loading, submitEligibility };
}

export function useDemoSession(sessionId: string) {
  const [session, setSession] = useState<MockUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDemoMode() || !sessionId) {
      setLoading(false);
      return;
    }

    let currentSession = getMockSession(sessionId);
    if (!currentSession) {
      currentSession = createMockSession(sessionId);
    }
    setSession(currentSession);
    setLoading(false);
  }, [sessionId]);

  const createSession = async () => {
    if (!isDemoMode() || !sessionId) return { success: false, error: "Invalid session" };
    
    const newSession = createMockSession(sessionId);
    setSession(newSession);
    return { success: true, queuePosition: newSession.queue_position, existing: false };
  };

  return { session, loading, createSession };
}

export function useDemoTimer() {
  const [timer, setTimer] = useState<MockCountdownTimer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDemoMode()) {
      setLoading(false);
      return;
    }

    const currentTimer = getMockTimer();
    setTimer(currentTimer);
    setLoading(false);
  }, []);

  return { timer, loading };
}

export function useDemoQueue() {
  const [queue, setQueue] = useState<MockQueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDemoMode()) {
      setLoading(false);
      return;
    }

    const currentQueue = getMockQueue();
    setQueue(currentQueue);
    setLoading(false);
  }, []);

  return { queue, loading };
}

// Wrapper function to handle server actions in demo mode
export async function handleDemoAction<T>(
  action: () => Promise<T>,
  mockAction: () => T | Promise<T>
): Promise<T> {
  if (isDemoMode()) {
    return await mockAction();
  }
  return await action();
}
