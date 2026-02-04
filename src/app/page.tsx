"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getCountdownTimer, getQueueStatus, createUserSession, getUserSession, selectUsersForReferral, checkEligibilityStatus } from "./actions";
import TestingNavigation from "@/components/TestingNavigation";
import { shouldShowDebugInfo, isTestingMode, isDemoMode } from "@/lib/config";
import { useDemoSession, useDemoTimer, useDemoQueue } from "@/lib/demo-hooks";
import { getMockEligibility, getMockSession, getMockTimer, getMockQueue, createMockSession } from "@/lib/mock-data";

export default function WaitingRoomNew() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [isResumingSession, setIsResumingSession] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [userSelectionTriggered, setUserSelectionTriggered] = useState(false);
  
  // Demo mode hooks
  const { session: demoSession, createSession: createDemoSession } = useDemoSession(sessionId);
  const { timer: demoTimer } = useDemoTimer();
  const { queue: demoQueue } = useDemoQueue();

  // Session ID setup and database initialization
  useEffect(() => {
    const initializeApp = async () => {
      console.log("Initializing app...");
      
      // Set up session ID
      const existingSessionId = localStorage.getItem('referral_session_id');
      let currentSessionId: string;
      
      if (existingSessionId) {
        console.log("Found existing session ID:", existingSessionId);
        currentSessionId = existingSessionId;
        setSessionId(existingSessionId);
        setIsResumingSession(true);
      } else {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("Created new session ID:", newSessionId);
        localStorage.setItem('referral_session_id', newSessionId);
        currentSessionId = newSessionId;
        setSessionId(newSessionId);
        setIsResumingSession(false);
      }
      
      // Check eligibility status (skip in testing/demo mode)
      if (isDemoMode()) {
        // In demo mode, check mock eligibility
        const { initializeMockData } = await import("@/lib/mock-data");
        initializeMockData();
        const mockEligibility = getMockEligibility(currentSessionId);
        if (!mockEligibility) {
          console.log("No eligibility check found in demo mode, redirecting to eligibility page");
          router.push('/eligibility');
          return;
        }
      } else if (!isTestingMode()) {
        try {
          const eligibility = await checkEligibilityStatus(currentSessionId);
          if (!eligibility) {
            console.log("No eligibility check found, redirecting to eligibility page");
            router.push('/eligibility');
            return;
          }
        } catch (err) {
          console.error("Error checking eligibility:", err);
          // If there's an error, redirect to eligibility page to be safe
          router.push('/eligibility');
          return;
        }
      }
      
      // Load data from database or mock data
      try {
        if (isDemoMode()) {
          console.log("Loading mock data for demo mode...");
          const { initializeMockData } = await import("@/lib/mock-data");
          initializeMockData();
          
          // Get mock timer
          const mockTimer = getMockTimer();
          if (mockTimer) {
            const endTime = new Date(mockTimer.end_time).getTime();
            const now = new Date().getTime();
            const timeLeft = Math.max(0, endTime - now);
            setCountdown(timeLeft);
            console.log("Mock countdown timer loaded:", timeLeft);
          }
          
          // Get mock queue
          const mockQueue = getMockQueue();
          if (mockQueue) {
            setQueueStatus(mockQueue);
            setQueuePosition(mockQueue.queue_position || 1);
            console.log("Mock queue status loaded:", mockQueue);
          }
          
          setDataLoaded(true);
          console.log("Mock data loaded successfully");
        } else {
          console.log("Loading data from database...");
          
          // Get countdown timer
          const timer = await getCountdownTimer();
          if (timer) {
            const endTime = new Date(timer.end_time).getTime();
            const now = new Date().getTime();
            const timeLeft = Math.max(0, endTime - now);
            setCountdown(timeLeft);
            console.log("Countdown timer loaded:", timeLeft);
          } else {
            console.log("No countdown timer found, using default");
            setCountdown(3600000); // 1 hour default
          }
          
          // Get queue status
          const queue = await getQueueStatus();
          if (queue) {
            setQueueStatus(queue);
            setQueuePosition(queue.queue_position || 1);
            console.log("Queue status loaded:", queue);
          } else {
            console.log("No queue status found, using default");
            setQueuePosition(1);
          }
          
          setDataLoaded(true);
          console.log("Database data loaded successfully");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        // Use defaults if loading fails
        setCountdown(3600000);
        setQueuePosition(1);
        setDataLoaded(true);
      }
      
      console.log("Setting loading to false");
      setLoading(false);
    };
    
    initializeApp();
  }, []); // Empty dependency array - only run once

  // Handle user session creation after data is loaded
  useEffect(() => {
    const createSession = async () => {
      if (!sessionId || !dataLoaded || userSession) return;
      
      console.log("Creating user session for:", sessionId);
      try {
        if (isDemoMode()) {
          // Use mock session in demo mode
          let mockSession = getMockSession(sessionId);
          if (!mockSession) {
            mockSession = createMockSession(sessionId);
          }
          console.log("Using mock session:", mockSession);
          setUserSession(mockSession);
          if (mockSession.queue_position) {
            setQueuePosition(mockSession.queue_position);
          }
        } else {
          // First check if session already exists
          const existingSession = await getUserSession(sessionId);
          if (existingSession) {
            console.log("Found existing user session:", existingSession);
            setUserSession(existingSession);
            if (existingSession.queue_position) {
              setQueuePosition(existingSession.queue_position);
            }
          } else {
            // Create new session
            const sessionResult = await createUserSession(sessionId);
            if (sessionResult.success) {
              console.log("Created new user session:", sessionResult);
              const newSession = await getUserSession(sessionId);
              setUserSession(newSession);
              if (newSession?.queue_position) {
                setQueuePosition(newSession.queue_position);
              }
            } else {
              console.error("Failed to create user session:", sessionResult.error);
            }
          }
        }
      } catch (err) {
        console.error("Error handling user session:", err);
      }
    };
    
    createSession();
  }, [sessionId, dataLoaded, userSession]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      if (!countdownCompleted) {
        console.log("Countdown reached zero!");
        setCountdownCompleted(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          console.log("Countdown completed!");
          setCountdownCompleted(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, countdownCompleted]);

  // Handle user selection when countdown completes
  useEffect(() => {
    const handleUserSelection = async () => {
      if (!countdownCompleted || userSelectionTriggered || !userSession) return;
      
      console.log("Triggering user selection...");
      setUserSelectionTriggered(true);
      
      try {
        await selectUsersForReferral();
        console.log("User selection completed");
      } catch (error) {
        console.error("Error during user selection:", error);
      }
    };
    
    handleUserSelection();
  }, [countdownCompleted, userSelectionTriggered, userSession]);

  // Handle redirects based on user status
  useEffect(() => {
    if (!userSession || !countdownCompleted) return;
    
    // Skip automatic redirects in testing/development mode
    if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true' || 
        process.env.NODE_ENV === 'development' ||
        process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
      console.log("Testing/Development mode: Skipping automatic redirects");
      return;
    }
    
    console.log("Checking user status for redirect:", userSession.status);
    
    switch (userSession.status) {
      case 'selected':
        console.log("User selected - redirecting to referral form");
        router.push('/referral-form');
        break;
      case 'rejected':
        console.log("User rejected - redirecting to not selected page");
        router.push('/not-selected');
        break;
      case 'completed':
        console.log("User completed - redirecting to submitted page");
        router.push('/submitted');
        break;
      default:
        console.log("User still waiting, no redirect needed");
    }
  }, [userSession, countdownCompleted, router]);

  // Poll for status updates after countdown completes
  useEffect(() => {
    if (!countdownCompleted || !userSession || userSession.status !== 'waiting') return;
    
    console.log("Starting status polling after countdown completion");
    
    const pollInterval = setInterval(async () => {
      try {
        const updatedSession = await getUserSession(sessionId);
        if (updatedSession && updatedSession.status !== userSession.status) {
          console.log("Status update detected:", updatedSession.status);
          setUserSession(updatedSession);
        }
      } catch (error) {
        console.error("Error polling user session:", error);
      }
    }, 2000); // Poll every 2 seconds
    
    return () => {
      console.log("Stopping status polling");
      clearInterval(pollInterval);
    };
  }, [countdownCompleted, userSession, sessionId]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const clearSession = () => {
    console.log('Clearing session...');
    localStorage.removeItem('referral_session_id');
    setSessionId("");
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
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
          <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Error</h1>
          <p className="text-black mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TestingNavigation currentPage="/" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Referral Program Waiting Room
            </h1>
            <p className="text-lg text-black">
              {/* {isResumingSession ? "Welcome back! You're in the queue." :  */}
              Welcome! You've joined the queue.
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
                  {countdown > 0 
                    ? "Time remaining until selection begins" 
                    : countdownCompleted 
                      ? "Selection completed! Please wait for your status update..."
                      : "Selection in progress..."
                  }
                </p>
              </div>
            </div>

            {/* Queue Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-black">Queue Status</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-black">Total in Queue:</span>
                  <span className="text-lg font-semibold text-black">
                    {queueStatus?.queue_position || queuePosition}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-black">Spots Available:</span>
                  <span className="text-lg font-semibold text-green-600">
                    40
                  </span>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {countdown > 0 
                        ? "You're in the queue! Please wait for the countdown to finish."
                        : countdownCompleted
                          ? "Selection completed! Please wait for your status update..."
                          : "Selection in progress..."
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          {/* <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-black mb-4">Session Information</h3>
            <div className="space-y-2 text-black">
              <p><strong>Session ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-black">{sessionId}</code></p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{userSession?.status || 'Waiting in Queue'}</span></p>
              <p><strong>Session Type:</strong> <span className="text-blue-600">{isResumingSession ? 'Resumed' : 'New'}</span></p>
              <p><strong>Data Loaded:</strong> <span className="text-purple-600">{dataLoaded ? 'Yes' : 'No'}</span></p>
              <p><strong>Countdown Source:</strong> <span className="text-orange-600">{countdown > 0 ? 'Database' : 'Default'}</span></p>
              <p><strong>Countdown Status:</strong> <span className="text-red-600">{countdownCompleted ? 'Completed' : 'Running'}</span></p>
              <p><strong>Selection Triggered:</strong> <span className="text-yellow-600">{userSelectionTriggered ? 'Yes' : 'No'}</span></p>
            </div>
          </div> */}

          {/* Debug Controls - Only show in testing/development mode */}
          {/* {shouldShowDebugInfo() && (
            <div className="mt-8 bg-yellow-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-black mb-4">Debug Controls</h3>
              <div className="space-x-4">
                <button
                  onClick={clearSession}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Clear Session & Reload
                </button>
                <a
                  href="/minimal"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                >
                  Test Minimal Page
                </a>
              </div>
            </div>
          )} */}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-black">
            <p>Referral Program V2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
