"use client";

import { useEffect, useState } from "react";

export default function SimplePage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    addLog("Component mounted");
    
    const existingSessionId = localStorage.getItem('referral_session_id');
    
    if (existingSessionId) {
      addLog(`Found existing session: ${existingSessionId}`);
      setSessionId(existingSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addLog(`Created new session: ${newSessionId}`);
      localStorage.setItem('referral_session_id', newSessionId);
      setSessionId(newSessionId);
    }
    
    addLog("Setting loading to false");
    setLoading(false);
    addLog("Component initialization complete");
  }, []);

  const clearSession = () => {
    addLog("Clearing session");
    localStorage.removeItem('referral_session_id');
    setSessionId("");
    setLogs([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">Loading simple page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Simple Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Session Info</h2>
          <p><strong>Session ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code></p>
          <p><strong>LocalStorage:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{localStorage.getItem('referral_session_id') || 'None'}</code></p>
          
          <button
            onClick={clearSession}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Clear Session
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Console Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            Back to Main Page
          </a>
        </div>
      </div>
    </div>
  );
}
