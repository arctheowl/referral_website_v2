"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  bootstrapReferralSession,
  getCountdownTimer,
  resolveSelectionOutcome,
} from "./actions";
import { isTestingMode, isDemoMode } from "@/lib/config";
import { getMockEligibility, getMockSession, getMockTimer, runMockRandomSelection } from "@/lib/mock-data";

export default function WaitingRoomNew() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [countdownLoaded, setCountdownLoaded] = useState(false);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [userSelectionTriggered, setUserSelectionTriggered] = useState(false);

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
      } else {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("Created new session ID:", newSessionId);
        localStorage.setItem('referral_session_id', newSessionId);
        currentSessionId = newSessionId;
        setSessionId(newSessionId);
      }

      const bootstrap = await bootstrapReferralSession(currentSessionId);
      if (!bootstrap.success) {
        setError("Unable to verify your session");
        setLoading(false);
        return;
      }

      if (bootstrap.status === "rejected") {
        router.replace("/not-selected");
        return;
      }
      if (bootstrap.status === "selected") {
        router.replace("/selected");
        return;
      }
      if (bootstrap.status === "completed") {
        router.replace("/submitted");
        return;
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
      } else if (!isTestingMode() && !bootstrap.hasEligibility) {
        console.log("No eligibility check found, redirecting to eligibility page");
        router.push('/eligibility');
        return;
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
            setCountdownLoaded(true);
            console.log("Mock countdown timer loaded:", timeLeft);
          }
          
          console.log("Mock data loaded successfully");
        } else {
          console.log("Loading countdown timer from database...");
          const countdownTimer = await getCountdownTimer();
          if (!countdownTimer?.end_time) {
            setError("Countdown timer not configured");
            setLoading(false);
            return;
          }
          const endTime = new Date(countdownTimer.end_time).getTime();
          const now = new Date().getTime();
          const timeLeft = Math.max(0, endTime - now);
          setCountdown(timeLeft);
          setCountdownLoaded(true);
          console.log("Database countdown loaded:", timeLeft);
          console.log("Database data loaded successfully");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setCountdown(0);
        setCountdownLoaded(true);
      }
      
      console.log("Setting loading to false");
      setLoading(false);
    };
    
    initializeApp();
  }, [router]);

  // Countdown timer effect
  useEffect(() => {
    if (!countdownLoaded) return;

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
  }, [countdown, countdownCompleted, countdownLoaded]);

  // Handle redirect when countdown completes using persisted DB selection.
  useEffect(() => {
    if (!countdownLoaded || !countdownCompleted || userSelectionTriggered || !sessionId) return;

    console.log("Countdown completed - redirecting user");
    setUserSelectionTriggered(true);

    if (isDemoMode()) {
      const eligibility = getMockEligibility(sessionId);
      if (eligibility && eligibility.eligible === false) {
        router.push("/not-selected");
        return;
      }
      runMockRandomSelection(40);
      const updated = getMockSession(sessionId);
      console.log("Demo selection completed:", updated?.status || "unknown");
      if (updated?.status === "selected") {
        router.push("/selected");
        return;
      }
      router.push("/not-selected");
      return;
    }

    (async () => {
      const maxAttempts = 10;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const result = await resolveSelectionOutcome(sessionId);
        if (!result.success) {
          setError(result.error || "Failed to run selection");
          return;
        }

        if (result.pending) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        if (result.status === "selected") {
          router.push("/selected");
          return;
        }
        if (result.status === "rejected") {
          router.push("/not-selected");
          return;
        }

        setError("Selection is still processing. Please refresh in a moment.");
        return;
      }
      setError("Selection is still processing. Please refresh in a moment.");
    })();
  }, [countdownLoaded, countdownCompleted, userSelectionTriggered, sessionId, router]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-black">Loading waiting room...</p>
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
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
       
        {/* Logo - same position as eligibility page */}
        <div className="flex flex-col items-center justify-center lg:col-span-1 min-h-[200px] lg:min-h-[80vh]">
          <img
            src="/MustardSeed_Primary-Logo.png"
            alt="Mustard Seed"
            className="w-full max-w-[220px] h-full object-contain"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-2">
          <div className="max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Referral Program Waiting Room
            </h1>
            <p className="text-lg text-black">
              Welcome! You&apos;ve joined the queue.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-1 gap-8">
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

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    {countdown > 0
                      ? "You&apos;re in the waiting room. Please wait for the countdown to finish."
                      : countdownCompleted
                        ? "Selection completed! Please wait for your status update..."
                        : "Selection in progress..."
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-black">
           
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
