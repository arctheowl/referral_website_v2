"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { isDemoMode } from "@/lib/config";
import { directPagePreview } from "@/lib/preview";
import { getAuthorizedFlowState } from "@/app/actions";
import { getMockEffectiveSessionStatus } from "@/lib/mock-data";

interface FlowEnforcementProps {
  children: React.ReactNode;
  requiredStatus?: "waiting" | "selected" | "rejected" | "completed";
}

function isGateStatus(
  s: FlowEnforcementProps["requiredStatus"]
): s is "waiting" | "selected" | "rejected" | "completed" {
  return s === "waiting" || s === "selected" || s === "rejected" || s === "completed";
}

export default function FlowEnforcement({
  children,
  requiredStatus,
}: FlowEnforcementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  const redirectForStatus = useCallback(
    (status: "waiting" | "selected" | "rejected" | "completed"): void => {
      switch (status) {
        case "waiting":
          router.push("/");
          return;
        case "selected":
          router.push("/selected");
          return;
        case "rejected":
          router.push("/not-selected");
          return;
        case "completed":
          router.push("/submitted");
          return;
      }
    },
    [router]
  );

  useEffect(() => {
    const enforceFlow = async () => {
      const gate = isGateStatus(requiredStatus);

      if (!gate || directPagePreview) {
        setLoading(false);
        return;
      }

      if (isDemoMode()) {
        const existingSessionId = localStorage.getItem("referral_session_id");
        if (!existingSessionId) {
          setError("No session found. Please start from the main page.");
          setLoading(false);
          return;
        }
        setSessionId(existingSessionId);
        const { initializeMockData } = await import("@/lib/mock-data");
        initializeMockData();
        const status = getMockEffectiveSessionStatus(existingSessionId);
        if (status === null) {
          setError("Invalid session. Please start from the main page.");
          setLoading(false);
          return;
        }
        if (requiredStatus && status !== requiredStatus) {
          redirectForStatus(status);
          return;
        }
        setLoading(false);
        return;
      }

      try {
        const state = await getAuthorizedFlowState();
        if (!state.authenticated || !state.status) {
          setError("Invalid session. Please start from the main page.");
          setLoading(false);
          return;
        }
        setSessionId(state.sessionId || "");

        if (requiredStatus && state.status !== requiredStatus) {
          const st = state.status;
          if (
            st === "waiting" ||
            st === "selected" ||
            st === "rejected" ||
            st === "completed"
          ) {
            redirectForStatus(st);
            return;
          }
          setError("Invalid user status. Please start from the main page.");
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error enforcing flow:", err);
        setError("Failed to verify session. Please start from the main page.");
        setLoading(false);
      }
    };

    enforceFlow();
  }, [redirectForStatus, requiredStatus]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Access Denied</h1>
          <p className="text-black mb-6">{error}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go to Main Page</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("referral_session_id");
                router.push("/");
              }}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Clear Session & Start Over
            </button>
          </div>

          {sessionId && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-black">
                <strong>Session ID:</strong>{" "}
                <code className="bg-gray-200 px-2 py-1 rounded text-xs">{sessionId}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
