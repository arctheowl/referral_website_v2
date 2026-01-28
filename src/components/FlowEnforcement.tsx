"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { 
  isProductionMode, 
  canAccessPageDirectly, 
  getCurrentConfig,
  isDemoMode
} from "@/lib/config";
import { getUserSession } from "@/app/actions";
import { getMockSession } from "@/lib/mock-data";

interface FlowEnforcementProps {
  children: React.ReactNode;
  requiredStatus?: 'waiting' | 'selected' | 'rejected' | 'completed';
  allowDirectAccess?: boolean;
}

export default function FlowEnforcement({ 
  children, 
  requiredStatus,
  allowDirectAccess = false 
}: FlowEnforcementProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const enforceFlow = async () => {
      // Skip enforcement in development/testing/demo modes
      // Also skip if we're in mock mode or testing mode
      if (isDemoMode()) {
        // In demo mode, check mock session
        const existingSessionId = localStorage.getItem('referral_session_id');
        if (existingSessionId) {
          const mockSession = getMockSession(existingSessionId);
          if (requiredStatus && mockSession && mockSession.status !== requiredStatus) {
            // In demo mode, allow access but log the mismatch
            console.log(`Demo mode: Status mismatch (expected ${requiredStatus}, got ${mockSession.status}), allowing access`);
          }
        }
        setLoading(false);
        return;
      }
      
      if (!isProductionMode() || 
          process.env.NEXT_PUBLIC_TESTING_MODE === 'true' || 
          process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
          process.env.NODE_ENV === 'development') {
        setLoading(false);
        return;
      }

      // Get session ID from localStorage
      const existingSessionId = localStorage.getItem('referral_session_id');
      if (!existingSessionId) {
        setError("No session found. Please start from the main page.");
        setLoading(false);
        return;
      }

      setSessionId(existingSessionId);

      try {
        // Check user session status
        const userSession = await getUserSession(existingSessionId);
        
        if (!userSession) {
          setError("Invalid session. Please start from the main page.");
          setLoading(false);
          return;
        }

        // Check if user has the required status for this page
        if (requiredStatus && userSession.status !== requiredStatus) {
          // Redirect based on current status
          switch (userSession.status) {
            case 'waiting':
              router.push('/');
              return;
            case 'selected':
              router.push('/referral-form');
              return;
            case 'rejected':
              router.push('/not-selected');
              return;
            case 'completed':
              router.push('/submitted');
              return;
            default:
              setError("Invalid user status. Please start from the main page.");
              setLoading(false);
              return;
          }
        }

        // If we get here, user has proper access
        setLoading(false);
      } catch (err) {
        console.error("Error enforcing flow:", err);
        setError("Failed to verify session. Please start from the main page.");
        setLoading(false);
      }
    };

    enforceFlow();
  }, [pathname, requiredStatus, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-black">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Access Denied</h1>
          <p className="text-black mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go to Main Page</span>
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('referral_session_id');
                router.push('/');
              }}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Clear Session & Start Over
            </button>
          </div>
          
          {sessionId && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-black">
                <strong>Session ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs">{sessionId}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render children if access is allowed
  return <>{children}</>;
}
