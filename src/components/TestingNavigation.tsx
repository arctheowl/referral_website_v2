"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { shouldShowAllNavigation, shouldShowDebugInfo, isTestingMode } from "@/lib/config";

interface TestingNavigationProps {
  currentPage?: string;
}

export default function TestingNavigation({ currentPage = "" }: TestingNavigationProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in testing mode or development
  if (!shouldShowAllNavigation()) {
    return null;
  }

  const pages = [
    {
      name: "Main Page (Waiting Room)",
      path: "/",
      icon: HomeIcon,
      description: "Main waiting room with countdown timer"
    },
    {
      name: "Referral Form",
      path: "/referral-form",
      icon: DocumentTextIcon,
      description: "Application form for selected users"
    },
    {
      name: "Not Selected",
      path: "/not-selected",
      icon: XCircleIcon,
      description: "Page for users not in first 50"
    },
    {
      name: "Submitted",
      path: "/submitted",
      icon: CheckCircleIcon,
      description: "Confirmation page after form submission"
    },
    {
      name: "Admin Dashboard",
      path: "/admin",
      icon: CogIcon,
      description: "Admin panel for managing the system"
    },
    {
      name: "Debug Pages",
      path: "/debug",
      icon: EyeIcon,
      description: "Debug version without database calls"
    },
    {
      name: "Minimal Test",
      path: "/minimal",
      icon: EyeSlashIcon,
      description: "Minimal test page"
    },
    {
      name: "Session Test",
      path: "/session-test",
      icon: CogIcon,
      description: "Session testing and database operations"
    }
  ];

  const handlePageNavigation = (path: string) => {
    router.push(path);
    setIsExpanded(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Testing Navigation"
      >
        <CogIcon className="h-6 w-6" />
      </button>

      {/* Navigation Panel */}
      {isExpanded && (
        <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">
              Testing Navigation
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-black hover:text-black"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Environment Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <p><strong>Mode:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  isTestingMode() ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {isTestingMode() ? 'TESTING' : 'DEVELOPMENT'}
                </span>
              </p>
              <p><strong>Current Page:</strong> <span className="text-black">{currentPage || '/'}</span></p>
            </div>
          </div>

          {/* Page List */}
          <div className="space-y-2">
            {pages.map((page) => {
              const Icon = page.icon;
              const isCurrentPage = currentPage === page.path;
              
              return (
                <button
                  key={page.path}
                  onClick={() => handlePageNavigation(page.path)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isCurrentPage 
                      ? 'bg-purple-50 border-purple-200 text-purple-900' 
                      : 'bg-gray-50 border-gray-200 text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      isCurrentPage ? 'text-purple-600' : 'text-black'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        isCurrentPage ? 'text-purple-900' : 'text-black'
                      }`}>
                        {page.name}
                        {isCurrentPage && <span className="ml-2 text-xs">(current)</span>}
                      </p>
                      <p className="text-xs text-black mt-1">
                        {page.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-black mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.removeItem('referral_session_id');
                  router.push('/');
                }}
                className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Clear Session & Go Home
              </button>
              <button
                onClick={() => {
                  window.open('/admin', '_blank');
                }}
                className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Open Admin in New Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
