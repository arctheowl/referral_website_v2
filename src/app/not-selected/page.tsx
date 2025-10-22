"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  HeartIcon, 
  BookOpenIcon, 
  PhoneIcon, 
  GlobeAltIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { getUserSession, addToWaitlist } from "../actions";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";
import { isTestingMode } from "@/lib/config";

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

      // Skip database validation in testing mode
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
      const result = await addToWaitlist(sessionId, waitlistData);
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
              Unfortunately, you were not among the first 50 applicants selected for this round. 
              However, we have valuable resources and alternative options to support you and your family.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Waitlist Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
                Join Our Waitlist
              </h2>
              
              {!waitlistSuccess ? (
                <>
                  <p className="text-black mb-4">
                    Be the first to know about future opportunities and priority access to our services.
                  </p>
                  
                  {!showWaitlistForm ? (
                    <button
                      onClick={() => setShowWaitlistForm(true)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Join Waitlist
                    </button>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={waitlistData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={waitlistData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Child's Name
                        </label>
                        <input
                          type="text"
                          value={waitlistData.childName}
                          onChange={(e) => handleInputChange('childName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Child's Date of Birth
                        </label>
                        <input
                          type="date"
                          value={waitlistData.childDOB}
                          onChange={(e) => handleInputChange('childDOB', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={waitlistData.postcode}
                          onChange={(e) => handleInputChange('postcode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submitting ? "Adding..." : "Add to Waitlist"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowWaitlistForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50"
                        >
                          Cancel
                        </button>
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
                  <p className="text-green-600 font-medium">Successfully added to waitlist!</p>
                  <p className="text-sm text-black mt-1">We'll notify you about future opportunities.</p>
                </div>
              )}
            </div>

            {/* Alternative Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
                <HeartIcon className="h-6 w-6 text-red-600 mr-2" />
                Alternative Resources
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Local Support Services
                  </h3>
                  <p className="text-sm text-blue-800">
                    Contact your local council&apos;s children&apos;s services department for immediate support and guidance.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Educational Support
                  </h3>
                  <p className="text-sm text-green-800">
                    Speak with your child&apos;s school SENCO (Special Educational Needs Coordinator) about available support.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Parent Support Groups
                  </h3>
                  <p className="text-sm text-purple-800">
                    Join local parent support groups and online communities for peer support and advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Links */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-6 flex items-center">
              <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-2" />
              Helpful Resources & Links
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">National Autistic Society</h3>
                <p className="text-sm text-black mb-3">
                  Comprehensive information, support, and resources for families affected by autism.
                </p>
                <a 
                  href="https://www.autism.org.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Visit Website
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">Contact - For Families</h3>
                <p className="text-sm text-black mb-3">
                  Support and information for families with disabled children.
                </p>
                <a 
                  href="https://www.contact.org.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Visit Website
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">NHS - Children's Services</h3>
                <p className="text-sm text-black mb-3">
                  Information about NHS services and support for children with additional needs.
                </p>
                <a 
                  href="https://www.nhs.uk/conditions/children-and-adolescent-mental-health-services-camhs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Visit Website
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">Local Authority Support</h3>
                <p className="text-sm text-black mb-3">
                  Find your local council&apos;s children&apos;s services and support options.
                </p>
                <a 
                  href="https://www.gov.uk/find-local-council" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Find Your Council
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">SEND Support</h3>
                <p className="text-sm text-black mb-3">
                  Information about Special Educational Needs and Disabilities support.
                </p>
                <a 
                  href="https://www.gov.uk/children-with-special-educational-needs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Learn More
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-black mb-2">Parent Support Groups</h3>
                <p className="text-sm text-black mb-3">
                  Connect with other parents facing similar challenges in your area.
                </p>
                <a 
                  href="https://www.facebook.com/groups" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Find Groups
                </a>
              </div>
            </div>
          </div>

          {/* Emergency Support */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Need Immediate Support?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Crisis Support</h3>
                <p className="text-sm text-red-700 mb-2">
                  If you or your child are in immediate danger or experiencing a mental health crisis:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Call 999 for emergency services</li>
                  <li>• Contact your local A&E department</li>
                  <li>• Call Samaritans: 116 123 (free, 24/7)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Mental Health Support</h3>
                <p className="text-sm text-red-700 mb-2">
                  For mental health support and advice:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Childline: 0800 1111</li>
                  <li>• YoungMinds: 0808 802 5544</li>
                  <li>• Mind: 0300 123 3393</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-black">
            <p>
              Thank you for your interest in our program. We appreciate your patience and understanding.
            </p>
            <p className="mt-2">
              For any questions, please contact us at{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                support@example.com
              </a>
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
