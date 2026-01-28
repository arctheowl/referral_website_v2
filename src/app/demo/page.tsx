"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PlayIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";
import { clearMockData, initializeMockData } from "@/lib/mock-data";
import TestingNavigation from "@/components/TestingNavigation";
import { isDemoMode } from "@/lib/config";

type UserStatus = 'waiting' | 'selected' | 'rejected' | 'completed';

interface Flow {
  id: string;
  name: string;
  description: string;
  status: UserStatus;
  icon: typeof PlayIcon;
  color: string;
  steps: string[];
}

const FLOWS: Flow[] = [
  {
    id: 'new-user',
    name: 'New User Flow',
    description: 'Start from eligibility check and go through the complete process',
    status: 'waiting',
    icon: PlayIcon,
    color: 'blue',
    steps: [
      '1. Complete eligibility form',
      '2. Join waiting room',
      '3. Wait for selection',
      '4. Get selected or rejected',
      '5. Complete referral form (if selected)'
    ]
  },
    {
    id: 'waiting',
    name: 'Waiting in Queue',
    description: 'See the waiting room experience',
    status: 'waiting',
    icon: ClockIcon,
    color: 'purple',
    steps: [
      '1. Already eligible',
      '2. In waiting room',
      '3. See countdown timer',
      '4. View queue position'
    ]
  },
  {
    id: 'selected',
    name: 'Selected User',
    description: 'Experience the flow as a selected user who can complete the referral form',
    status: 'selected',
    icon: CheckCircleIcon,
    color: 'green',
    steps: [
      '1. Already eligible',
      '2. In waiting room',
      '3. Selected for referral',
      '4. Complete referral form',
      '5. View submission confirmation'
    ]
  },
  {
    id: 'rejected',
    name: 'Not Selected',
    description: 'See what happens when a user is not in the first 50 applicants',
    status: 'rejected',
    icon: XCircleIcon,
    color: 'red',
    steps: [
      '1. Already eligible',
      '2. In waiting room',
      '3. Not selected (not in first 50)',
      '4. View resources and waitlist options'
    ]
  },

  {
    id: 'completed',
    name: 'Successfully Submitted',
    description: 'View the confirmation page after successfully submitting the referral form',
    status: 'completed',
    icon: DocumentCheckIcon,
    color: 'green',
    steps: [
      '1. Already eligible',
      '2. Selected for referral',
      '3. Completed referral form',
      '4. View submission confirmation',
      '5. See next steps information'
    ]
  }
];

export default function DemoPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  useEffect(() => {
    // Only initialize if in demo mode
    if (isDemoMode()) {
      initializeMockData();
    }
    
    // Get or create session ID
    let existingSessionId = localStorage.getItem('referral_session_id');
    if (!existingSessionId) {
      existingSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('referral_session_id', existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);

  const handleStartFlow = (flow: Flow) => {
    // Clear existing data
    clearMockData();
    initializeMockData();
    
    // Set up mock data for all flows (except new-user which starts at eligibility)
    if (flow.id !== 'new-user') {
      // For all other flows, create eligibility and set status
      const mockData = {
        eligibility: {
          [sessionId]: {
            session_id: sessionId,
            school_year: 'Year 5',
            catchment_town: 'Odiham',
            can_attend_hospital: true,
            submitted_at: new Date().toISOString()
          }
        },
        sessions: {
          [sessionId]: {
            session_id: sessionId,
            queue_position: flow.status === 'selected' ? 25 : flow.status === 'rejected' ? 55 : flow.status === 'completed' ? 25 : 30,
            status: flow.status,
            joined_at: new Date().toISOString(),
            ...(flow.status === 'selected' && { selected_at: new Date().toISOString() }),
            ...(flow.status === 'rejected' && { selected_at: null }),
            ...(flow.status === 'completed' && { 
              selected_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              completed_at: new Date().toISOString() 
            })
          }
        },
        timer: {
          start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          is_active: true
        },
        queue: {
          max_users: 50,
          current_users: flow.status === 'selected' ? 25 : 0,
          queue_position: flow.status === 'selected' ? 50 : flow.status === 'rejected' ? 55 : 30,
          is_open: true
        }
      };
      localStorage.setItem('demo_referral_data', JSON.stringify(mockData));
    }
    
    setSelectedFlow(flow.id);
    
    // Navigate based on flow
    if (flow.id === 'new-user') {
      router.push('/eligibility');
    } else if (flow.status === 'selected') {
      router.push('/referral-form');
    } else if (flow.status === 'rejected') {
      router.push('/not-selected');
    } else if (flow.status === 'completed') {
      router.push('/submitted');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <TestingNavigation currentPage="/demo" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demo Mode - Flow Selector
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Select a user flow to experience different parts of the referral system. 
              This demo mode works without a database and uses mock data stored in your browser.
            </p>
          </div>

          {/* Info Banner */}
          {isDemoMode() ? (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3 text-sm text-blue-900">
                  <p className="font-medium mb-1">Demo Mode Active</p>
                  <p>
                    All data is stored locally in your browser. No database connection required. 
                    You can reset and try different flows at any time.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                </div>
                <div className="ml-3 text-sm text-yellow-900">
                  <p className="font-medium mb-1">Demo Mode Not Enabled</p>
                  <p>
                    To use demo mode, run: <code className="bg-yellow-100 px-2 py-1 rounded text-xs">./scripts/enable-demo-mode.sh</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Flow Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {FLOWS.map((flow) => {
              const Icon = flow.icon;
              
              // Map color to Tailwind classes
              const colorClasses = {
                blue: {
                  border: 'border-blue-500',
                  bg: 'bg-blue-100',
                  icon: 'text-blue-600',
                  button: 'bg-blue-600 hover:bg-blue-700'
                },
                green: {
                  border: 'border-green-500',
                  bg: 'bg-green-100',
                  icon: 'text-green-600',
                  button: 'bg-green-600 hover:bg-green-700'
                },
                red: {
                  border: 'border-red-500',
                  bg: 'bg-red-100',
                  icon: 'text-red-600',
                  button: 'bg-red-600 hover:bg-red-700'
                },
                purple: {
                  border: 'border-purple-500',
                  bg: 'bg-purple-100',
                  icon: 'text-purple-600',
                  button: 'bg-purple-600 hover:bg-purple-700'
                }
              };
              
              const colors = colorClasses[flow.color as keyof typeof colorClasses] || colorClasses.blue;
              
              return (
                <div
                  key={flow.id}
                  className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                    selectedFlow === flow.id
                      ? colors.border
                      : 'border-gray-200 hover:border-gray-300'
                  } transition-all`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`p-3 rounded-lg ${colors.bg} mr-4`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {flow.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {flow.description}
                      </p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">FLOW STEPS:</p>
                    <ul className="space-y-1">
                      {flow.steps.map((step, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartFlow(flow)}
                    className={`w-full ${colors.button} text-white py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center`}
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start {flow.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  clearMockData();
                  initializeMockData();
                  localStorage.removeItem('referral_session_id');
                  window.location.reload();
                }}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Reset All Data
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Go to Waiting Room
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Session ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs">{sessionId}</code>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This session ID is used to track your demo experience. All data is stored locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
