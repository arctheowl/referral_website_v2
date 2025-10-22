"use client";

import { useEffect, useState } from "react";
import { createUserSession, getUserSession } from "../actions";

export default function SessionTestPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    const existingSessionId = localStorage.getItem('referral_session_id');
    
    if (existingSessionId) {
      addResult(`Found existing session ID: ${existingSessionId}`);
      setSessionId(existingSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addResult(`Created new session ID: ${newSessionId}`);
      localStorage.setItem('referral_session_id', newSessionId);
      setSessionId(newSessionId);
    }
    
    setLoading(false);
  }, []);

  const testGetSession = async () => {
    if (!sessionId) return;
    
    addResult(`Testing getUserSession for: ${sessionId}`);
    try {
      const session = await getUserSession(sessionId);
      if (session) {
        addResult(`✅ Found session: ${JSON.stringify(session, null, 2)}`);
        setCurrentSession(session);
      } else {
        addResult(`❌ No session found`);
        setCurrentSession(null);
      }
    } catch (error) {
      addResult(`❌ Error getting session: ${error}`);
    }
  };

  const testCreateSession = async () => {
    if (!sessionId) return;
    
    addResult(`Testing createUserSession for: ${sessionId}`);
    try {
      const result = await createUserSession(sessionId);
      addResult(`✅ Create session result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      addResult(`❌ Error creating session: ${error}`);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('referral_session_id');
    setSessionId("");
    setCurrentSession(null);
    setTestResults([]);
    addResult("Session cleared");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">Loading session test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Session Test Page</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Session Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Session ID:
                </label>
                <p className="text-sm text-black font-mono bg-gray-50 p-2 rounded break-all">
                  {sessionId || 'None'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Current Session:
                </label>
                <pre className="text-xs text-black bg-gray-50 p-2 rounded overflow-auto max-h-40">
                  {currentSession ? JSON.stringify(currentSession, null, 2) : 'None'}
                </pre>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testGetSession}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Test Get Session
              </button>
              
              <button
                onClick={testCreateSession}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Test Create Session
              </button>
              
              <button
                onClick={clearSession}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Clear Session
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Test Results</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-black italic">No test results yet</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded text-black">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 underline mr-4"
          >
            Main Page
          </a>
          <a
            href="/debug"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Debug Page
          </a>
        </div>
      </div>
    </div>
  );
}
