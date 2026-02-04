"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  HeartIcon, 
  PhoneIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { getUserSession, addToWaitlist } from "../actions";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";
import { isTestingMode, isDemoMode } from "@/lib/config";
import { getMockSession } from "@/lib/mock-data";

interface WaitlistData {
  name: string;
  email: string;
  postcode: string;
  childDOB: string;
  childName: string;
}

function NotSelectedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistData, setWaitlistData] = useState<WaitlistData>({
    name: "",
    email: "",
    postcode: "",
    childDOB: "",
    childName: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  useEffect(() => {
    const session = searchParams.get('session');
    if (session) {
      setSessionId(session);
    } else {
      // Try to get from localStorage
      const existingSessionId = localStorage.getItem('referral_session_id');
      if (existingSessionId) {
        console.log("Found session ID in localStorage:", existingSessionId);
        setSessionId(existingSessionId);
      } else {
        // In testing mode, allow access without session ID
        if (isTestingMode()) {
          console.log("Testing mode: Allowing access without session ID");
          setSessionId('test-session-id');
        } else {
          console.log("No session ID found, redirecting to home");
          router.push('/');
        }
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!sessionId) return;

      // Skip database validation in testing/demo mode
      if (isDemoMode()) {
        console.log("Demo mode: Checking mock user status");
        const mockSession = getMockSession(sessionId);
        if (mockSession && mockSession.status === 'rejected') {
          console.log("Demo mode: User is rejected, showing not-selected page");
          setLoading(false);
          return;
        } else if (mockSession) {
          console.log("Demo mode: User status is", mockSession.status, "- allowing access for demo");
          setLoading(false);
          return;
        } else {
          console.log("Demo mode: No mock session found, allowing access");
          setLoading(false);
          return;
        }
      }

      if (isTestingMode()) {
        console.log("Testing mode: Skipping user status validation");
        setLoading(false);
        return;
      }

      try {
        const userSession = await getUserSession(sessionId);
        if (!userSession || userSession.status !== 'rejected') {
          // router.push('/');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [sessionId, router]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (isDemoMode()) {
        // In demo mode, simulate waitlist submission
        console.log("Demo mode: Simulating waitlist submission");
        // Store in localStorage for demo
        const waitlistKey = `demo_waitlist_${sessionId}`;
        localStorage.setItem(waitlistKey, JSON.stringify({
          ...waitlistData,
          sessionId,
          added_at: new Date().toISOString()
        }));
        result = { success: true };
      } else {
        result = await addToWaitlist(sessionId, waitlistData);
      }
      
      if (result.success) {
        setWaitlistSuccess(true);
      }
    } catch (err) {
      console.error("Error adding to waitlist:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof WaitlistData, value: string) => {
    setWaitlistData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <TestingNavigation currentPage="/not-selected" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <ExclamationTriangleIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-black mb-4">
              Thank You for Your Interest
            </h1>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Unfortunately you were not among the first 40 applicants randomly selected this round. We hope to open again in the autumn term. Please see other sources of support below.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Newsletter signup */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
                Sign up for our newsletter mailing list here
              </h2>
              <p className="text-black mb-4">
                To stay up to date with our news, events and future opportunities.
              </p>
              {!waitlistSuccess ? (
                <>
                  {!showWaitlistForm ? (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setShowWaitlistForm(true); }}
                      className="inline-block bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Sign up for newsletter
                    </a>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Your Name *</label>
                        <input type="text" required value={waitlistData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">Email Address *</label>
                        <input type="email" required value={waitlistData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                      </div>
                      <div className="flex space-x-3">
                        <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
                          {submitting ? "Submitting..." : "Sign up"}
                        </button>
                        <button type="button" onClick={() => setShowWaitlistForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50">Cancel</button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-600 font-medium">Successfully signed up!</p>
                  <p className="text-sm text-black mt-1">We&apos;ll keep you up to date with our news and future opportunities.</p>
                </div>
              )}
            </div>

            {/* Other Sources of Support */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
                <HeartIcon className="h-6 w-6 text-red-600 mr-2" />
                Other Sources of Support
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Mustard Seed Advice Line
                  </h3>
                  <p className="text-sm text-blue-900">
                    Please email <a href="mailto:office@mustardseedautism.co.uk" className="text-blue-700 underline">office@mustardseedautism.co.uk</a> for a call with one of our team to discuss any specific issues.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Branches
                  </h3>
                  <p className="text-sm text-green-900">
                    Our costed Occupational Therapy Service - please see our website for more information: <a href="https://mustardseedautism.co.uk/branches/" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">https://mustardseedautism.co.uk/branches/</a>
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Mustard Seed&apos;s Signposting Document
                  </h3>
                  <p className="text-sm text-purple-900">
                    Please email <a href="mailto:office@mustardseedautism.co.uk" className="text-purple-700 underline">office@mustardseedautism.co.uk</a> for a copy of our signposting document about other local groups and services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-black">
            <p>
              Thank you for your interest in our services. We appreciate your patience and understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotSelected() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    }>
      <FlowEnforcement requiredStatus="rejected">
        <NotSelectedContent />
      </FlowEnforcement>
    </Suspense>
  );
}
