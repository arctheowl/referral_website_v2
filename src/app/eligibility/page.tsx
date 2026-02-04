"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, AcademicCapIcon, MapPinIcon, BuildingOfficeIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { submitEligibilityCheck, checkEligibilityStatus } from "../actions";
import TestingNavigation from "@/components/TestingNavigation";
import { isTestingMode, isDemoMode } from "@/lib/config";
import { useDemoEligibility } from "@/lib/demo-hooks";

interface EligibilityData {
  parentName: string;
  primaryEmail: string;
  secondaryEmail: string;
  diagnosis: string;
  schoolYear: string;
  catchmentTown: string;
  canAttendHospital: boolean;
}

// Catchment towns
const CATCHMENT_TOWNS = [
  "Aldershot",
  "Farnborough",
  "Fleet",
  "Church Crookham",
  "Yateley",
  "Hartley Wintney",
  "Odiham",
  "Hook",
  "Farnham",
  "Badshot Lea",
  "Ash",
  "Ash Vale",
  "Bagshot",
  "Blackwater",
  "Camberley",
  "Frimley",
  "Frimley Green",
  "Mytchett",
  "Tongham",
  "Lightwater",
  "Pirbright",
  "Bisley"
];

// Diagnosis options
const DIAGNOSIS_OPTIONS = [
  { value: "diagnosis", label: "Child has autism diagnosis" },
  { value: "referred", label: "Child has been referred and is in process of obtaining autism diagnosis" }
];

// School years - Reception to Year 6 only
const SCHOOL_YEARS = [
  "Reception",
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6"
];

export default function EligibilityPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [eligibilityData, setEligibilityData] = useState<EligibilityData>({
    parentName: "",
    primaryEmail: "",
    secondaryEmail: "",
    diagnosis: "",
    schoolYear: "",
    catchmentTown: "",
    canAttendHospital: false
  });
  
  // Use demo hooks if in demo mode
  const { eligibility: demoEligibility, loading: demoLoading, submitEligibility: submitDemoEligibility } = useDemoEligibility(sessionId);

  useEffect(() => {
    const initializeSession = async () => {
      // Get or create session ID
      let existingSessionId = localStorage.getItem('referral_session_id');
      
      if (!existingSessionId) {
        existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('referral_session_id', existingSessionId);
      }
      
      setSessionId(existingSessionId);
      
      // Check if eligibility already submitted
      if (isDemoMode()) {
        // In demo mode, check mock data
        const { initializeMockData } = await import("@/lib/mock-data");
        initializeMockData();
        setLoading(false);
      } else if (!isTestingMode()) {
        try {
          const existingEligibility = await checkEligibilityStatus(existingSessionId);
          if (existingEligibility) {
            // Already submitted, redirect to waiting room
            router.push('/');
            return;
          }
        } catch (err) {
          console.error("Error checking eligibility:", err);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    initializeSession();
  }, [router]);

  const handleInputChange = (field: keyof EligibilityData, value: string | boolean) => {
    setEligibilityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation
    if (!eligibilityData.parentName) {
      setError("Please enter parent name");
      setSubmitting(false);
      return;
    }

    if (!eligibilityData.primaryEmail) {
      setError("Please enter primary email");
      setSubmitting(false);
      return;
    }

    if (!eligibilityData.diagnosis) {
      setError("Please select diagnosis status");
      setSubmitting(false);
      return;
    }

    if (!eligibilityData.schoolYear) {
      setError("Please select your child's school year");
      setSubmitting(false);
      return;
    }

    if (!eligibilityData.catchmentTown) {
      setError("Please select your catchment town");
      setSubmitting(false);
      return;
    }

    if (!eligibilityData.canAttendHospital) {
      setError("You must confirm that your child can be brought to Odiham Cottage Hospital during school hours to proceed");
      setSubmitting(false);
      return;
    }

    try {
      let result;
      if (isDemoMode()) {
        // Use mock data in demo mode
        result = await submitDemoEligibility({
          parentName: eligibilityData.parentName,
          primaryEmail: eligibilityData.primaryEmail,
          secondaryEmail: eligibilityData.secondaryEmail || undefined,
          diagnosis: eligibilityData.diagnosis,
          schoolYear: eligibilityData.schoolYear,
          catchmentTown: eligibilityData.catchmentTown,
          canAttendHospital: eligibilityData.canAttendHospital
        });
      } else {
        result = await submitEligibilityCheck(sessionId, {
          parentName: eligibilityData.parentName,
          primaryEmail: eligibilityData.primaryEmail,
          secondaryEmail: eligibilityData.secondaryEmail || undefined,
          diagnosis: eligibilityData.diagnosis,
          schoolYear: eligibilityData.schoolYear,
          catchmentTown: eligibilityData.catchmentTown,
          canAttendHospital: eligibilityData.canAttendHospital
        });
      }
      
      if (result.success) {
        // Redirect to waiting room
        router.push('/');
      } else {
        setError(result.error || "Failed to submit eligibility check");
      }
    } catch (err) {
      console.error("Error submitting eligibility:", err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <TestingNavigation currentPage="/eligibility" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Eligibility Check
            </h1>
            <p className="text-lg text-gray-900">
              Before joining the waiting room, please confirm your eligibility for our referral program.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-900">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Parent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={eligibilityData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  placeholder="Your name"
                />
              </div>

              {/* Primary Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Primary Email *
                </label>
                <input
                  type="email"
                  required
                  value={eligibilityData.primaryEmail}
                  onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  placeholder="your@email.com"
                />
              </div>

              {/* Secondary Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Secondary Email <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={eligibilityData.secondaryEmail}
                  onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                  placeholder="Second contact email (e.g. other parent)"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Diagnosis *
                </label>
                <select
                  required
                  value={eligibilityData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                >
                  <option value="">Please select...</option>
                  {DIAGNOSIS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* School Year */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                  What school year is your child in? *
                </label>
                <select
                  required
                  value={eligibilityData.schoolYear}
                  onChange={(e) => handleInputChange('schoolYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                >
                  <option value="">Please select...</option>
                  {SCHOOL_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catchment Town */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Which town are you located in? *
                </label>
                <select
                  required
                  value={eligibilityData.catchmentTown}
                  onChange={(e) => handleInputChange('catchmentTown', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                >
                  <option value="">Please select your town...</option>
                  {CATCHMENT_TOWNS.map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Confirmation */}
              <div className="border-t pt-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="canAttendHospital"
                    required
                    checked={eligibilityData.canAttendHospital}
                    onChange={(e) => handleInputChange('canAttendHospital', e.target.checked)}
                    className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="canAttendHospital" className="ml-3 text-sm text-gray-900">
                    <div className="flex items-start">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>
                        I confirm that my child can be brought to <strong>Odiham Cottage Hospital</strong> during school hours for appointments. *
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      This is required as our services are provided during school hours at this location.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? "Submitting..." : "Continue to Waiting Room"}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">What happens next?</p>
                  <p>Once you submit this form, you'll be taken to the waiting room where you'll join the queue for the referral program. Only the first 40 applicants will be selected to complete the full referral form.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
