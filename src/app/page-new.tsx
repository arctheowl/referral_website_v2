"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function WaitingRoomNew() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(3600000); // 1 hour default
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [isResumingSession, setIsResumingSession] = useState(false);

  // Simple session ID setup - no complex logic
  useEffect(() => {
    console.log("Setting up session ID...");
    
    const existingSessionId = localStorage.getItem('referral_session_id');
    
    if (existingSessionId) {
      console.log("Found existing session ID:", existingSessionId);
      setSessionId(existingSessionId);
      setIsResumingSession(true);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("Created new session ID:", newSessionId);
      localStorage.setItem('referral_session_id', newSessionId);
      setSessionId(newSessionId);
      setIsResumingSession(false);
    }
    
    // Simple countdown timer
    setCountdown(3600000); // 1 hour
    setQueuePosition(1);
    
    console.log("Setting loading to false");
    setLoading(false);
  }, []); // Empty dependency array - only run once

  // Simple countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Referral Program Waiting Room
            </h1>
            <p className="text-lg text-black">
              {isResumingSession ? "Welcome back! You're in the queue." : "Welcome! You've joined the queue."}
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
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-black">Your Position:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    #{queuePosition}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-black">Total in Queue:</span>
                  <span className="text-lg font-semibold text-black">
                    {queuePosition}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-black">Spots Available:</span>
                  <span className="text-lg font-semibold text-green-600">
                    50
                  </span>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      You&apos;re in the queue! Please wait for the countdown to finish.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-black mb-4">Session Information</h3>
            <div className="space-y-2">
              <p><strong>Session ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-black">{sessionId}</code></p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Waiting in Queue</span></p>
              <p><strong>Session Type:</strong> <span className="text-blue-600">{isResumingSession ? 'Resumed' : 'New'}</span></p>
            </div>
          </div>

          {/* Debug Controls */}
          <div className="mt-8 bg-yellow-50 rounded-lg shadow-lg p-6 text-black">
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

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-black">
            <p>Referral Program V2 - Simplified Version</p>
          </div>
        </div>
      </div>
    </div>
  );
}
