"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Test page loaded");
    
    // Check if user already has a session in localStorage
    const existingSessionId = localStorage.getItem('referral_session_id');
    
    if (existingSessionId) {
      console.log("Found existing session ID:", existingSessionId);
      setSessionId(existingSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log("Creating new session ID:", newSessionId);
      localStorage.setItem('referral_session_id', newSessionId);
      setSessionId(newSessionId);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">Loading test page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Session Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Session ID:
              </label>
              <p className="text-sm text-black font-mono bg-gray-50 p-2 rounded">
                {sessionId}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                LocalStorage Value:
              </label>
              <p className="text-sm text-black font-mono bg-gray-50 p-2 rounded">
                {localStorage.getItem('referral_session_id') || 'None'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem('referral_session_id');
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Clear Session & Reload
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Main Page
          </a>
        </div>
      </div>
    </div>
  );
}
