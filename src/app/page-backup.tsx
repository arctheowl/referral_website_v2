"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getCountdownTimer, getQueueStatus, createUserSession, getUserSession, selectUsersForReferral } from "./actions";

// interface CountdownTimer {
//   id: number;
//   start_time: string;
//   end_time: string;
//   is_active: boolean;
// }

interface QueueStatus {
  id: number;
  max_users: number;
  current_users: number;
  queue_position: number;
  is_open: boolean;
}

interface UserSession {
  id: number;
  session_id: string;
  queue_position: number;
  status: 'waiting' | 'selected' | 'rejected' | 'completed';
  joined_at: string;
  selected_at?: string;
  completed_at?: string;
}

export default function WaitingRoom() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isResumingSession, setIsResumingSession] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const userSessionRef = useRef<UserSession | null>(null);
  const initializingRef = useRef(false);

  // Generate or retrieve persistent session ID
  useEffect(() => {
    console.log("Setting up session ID...");
    // Check if user already has a session in localStorage
    const existingSessionId = localStorage.getItem('referral_session_id');
    
    if (existingSessionId) {
      // Use existing session
      console.log("Found existing session ID:", existingSessionId);
      setSessionId(existingSessionId);
    } else {
      // Create new session and store it
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("Creating new session ID:", newSessionId);
      localStorage.setItem('referral_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Function to clear session (for testing/debugging)
  const clearSession = () => {
    console.log('Clearing session...');
    localStorage.removeItem('referral_session_id');
    setInitialized(false);
    setSessionId("");
    setUserSession(null);
    userSessionRef.current = null;
    initializingRef.current = false;
    setLoading(true);
    // Don't reload, just reset state
  };

  // Initialize user session and fetch data
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionId || initialized || initializingRef.current) {
        console.log("No sessionId yet, already initialized, or currently initializing, waiting...");
        return;
      }

      console.log("Initializing session with ID:", sessionId);
      initializingRef.current = true;
      setInitialized(true);
      try {
        setLoading(true);
        
        // First, try to get existing session
        const existingSession = await getUserSession(sessionId);
        if (existingSession) {
          console.log("Found existing session, using it");
          setUserSession(existingSession);
          userSessionRef.current = existingSession;
          setIsResumingSession(true);
        } else {
          // Only create new session if none exists
          console.log("No existing session found, creating new one");
          const sessionResult = await createUserSession(sessionId);
          if (!sessionResult.success) {
            setError(sessionResult.error || "Failed to create session");
            setLoading(false);
            return;
          }
          
          // Track whether this is a new or existing session
          if (sessionResult.existing) {
            console.log("Resuming existing session");
            setIsResumingSession(true);
          } else {
            console.log("Created new session");
            setIsResumingSession(false);
          }
        }

        // Get user session details (if we created a new one)
        if (!existingSession) {
          const session = await getUserSession(sessionId);
          setUserSession(session);
          userSessionRef.current = session;
        }

        // Get queue status
        const queue = await getQueueStatus();
        setQueueStatus(queue);

        // Get countdown timer
        const timer = await getCountdownTimer();
        if (timer) {
          const endTime = new Date(timer.end_time).getTime();
          const now = new Date().getTime();
          const timeLeft = Math.max(0, endTime - now);
          setCountdown(timeLeft);
        }

      } catch (err) {
        console.error("Error initializing session:", err);
        setError("Failed to initialize session: " + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      } finally {
        setLoading(false);
        initializingRef.current = false;
      }
    };

    initializeSession();
  }, [sessionId]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle user selection when countdown reaches zero
  useEffect(() => {
    if (countdown === 0) {
      selectUsersForReferral().catch(console.error);
    }
  }, [countdown]);

  // Check user status and redirect accordingly
  useEffect(() => {
    if (!userSession || userSession.status === 'waiting') return;

    console.log('User status changed to:', userSession.status, 'redirecting...');
    
    switch (userSession.status) {
      case 'selected':
        router.push('/referral-form');
        break;
      case 'rejected':
        router.push('/not-selected');
        break;
      case 'completed':
        router.push('/submitted');
        break;
    }
  }, [userSession?.status, router]);

  // Poll for status updates
  useEffect(() => {
    if (!sessionId || !userSessionRef.current || userSessionRef.current.status !== 'waiting') return;

    console.log('Starting status polling for session:', sessionId);
    
    const pollInterval = setInterval(async () => {
      try {
        const session = await getUserSession(sessionId);
        if (session && session.status !== userSessionRef.current?.status) {
          console.log('Status update detected:', session.status);
          setUserSession(session);
          userSessionRef.current = session;
        }
      } catch (error) {
        console.error('Error polling user session:', error);
      }
    }, 5000); // Increased to 5 seconds to reduce load

    return () => {
      console.log('Stopping status polling');
      clearInterval(pollInterval);
    };
  }, [sessionId]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading || !sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-black">Loading waiting room...</p>
          {sessionId && <p className="text-sm text-black mt-2">Session: {sessionId.substring(0, 20)}...</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Error</h1>
          <p className="text-black">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Referral Program Waiting Room
            </h1>
            <p className="text-lg text-black">
              Please wait while we prepare the referral form. Only 50 applicants will be selected.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Countdown Timer */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ClockIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-black">Countdown Timer</h2>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-indigo-600 mb-4">
                  {formatTime(countdown)}
                </div>
                <p className="text-black">
                  {countdown > 0 ? "Time remaining until selection begins" : "Selection in progress..."}
                </p>
              </div>
            </div>

            {/* Queue Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-black">Queue Status</h2>
              </div>
              
              {userSession && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Your Position:</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      #{userSession.queue_position}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-black">Total in Queue:</span>
                    <span className="text-lg font-semibold text-black">
                      {queueStatus?.queue_position || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-black">Spots Available:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {queueStatus?.max_users || 50}
                    </span>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        {isResumingSession 
                          ? "Welcome back! You're still in the queue at your original position."
                          : "You're in the queue! Keep this page open and wait for the countdown to finish."
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-black mb-4">What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-black mb-2">Wait for Countdown</h4>
                <p className="text-sm text-black">
                  The countdown timer will show when the selection process begins.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-black mb-2">Selection Process</h4>
                <p className="text-sm text-black">
                  The first 50 people in the queue will be selected for the referral form.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-black mb-2">Complete Form</h4>
                <p className="text-sm text-black">
                  Selected users will be redirected to complete the referral application.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-black">
            <p>Please keep this page open. You will be automatically redirected when your turn comes.</p>
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={clearSession}
                className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
              >
                Clear Session (Dev Only)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}