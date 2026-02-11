"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { getUserSession } from "../actions";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";
import { isTestingMode, isDemoMode } from "@/lib/config";
import { getMockSession } from "@/lib/mock-data";

function SelectedContent() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingSessionId = localStorage.getItem("referral_session_id");
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else if (!isTestingMode()) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!sessionId && !isTestingMode()) return;

      if (isDemoMode()) {
        const mockSession = sessionId ? getMockSession(sessionId) : null;
        if (mockSession?.status === "selected") {
          setLoading(false);
          return;
        }
        if (mockSession?.status === "completed") {
          router.push("/submitted");
          return;
        }
        if (mockSession?.status === "rejected") {
          router.push("/not-selected");
          return;
        }
      }

      if (isTestingMode()) {
        setLoading(false);
        return;
      }

      try {
        const userSession = await getUserSession(sessionId);
        if (userSession?.status === "completed") {
          router.push("/submitted");
          return;
        }
        if (userSession?.status === "rejected") {
          router.push("/not-selected");
          return;
        }
        if (userSession?.status === "selected") {
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    checkStatus();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <TestingNavigation currentPage="/selected" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-black mb-4">
            You&apos;ve been selected!
          </h1>
          <p className="text-lg text-black mb-8">
            Congratulations! You were among those randomly selected from the waiting room. We will be in touch with next steps.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-black mb-4">What happens next</h2>
            <p className="text-black">
              Our team will contact you via email with further information. Please check your inbox (including junk folder) and ensure your contact details are up to date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Selected() {
  return (
    <FlowEnforcement requiredStatus="selected">
      <SelectedContent />
    </FlowEnforcement>
  );
}
