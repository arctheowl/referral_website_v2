"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, UserIcon, CalendarIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { getUserSession, submitReferralForm, checkFormSubmissionStatus } from "../actions";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";
import { shouldShowDebugInfo, isTestingMode } from "@/lib/config";

interface FormData {
  name: string;
  email: string;
  secondEmail: string;
  signposted: string;
  childName: string;
  childDOB: string;
  parentNames: string;
  siblings: string;
  address: string;
  phone: string;
  schoolName: string;
  schoolYear: string;
  diagnosis: string;
  diagnosisDate: string;
  medication: string;
  professionals: string;
  eligibility: string;
  interests: string;
  interestsBlob: string;
  communicateWithOthers: string;
  followInstructions: string;
  visualSupport: string;
  socialCommunication: string;
  highlyAnxious: string;
  recogniseEmotions: string;
  attendSchool: string;
  selfHarm: string;
  areasOfDifficulty: string;
  dailySkills: string;
  additionalSupport: string;
  consent: boolean;
}

function ReferralFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmissionStatus, setFormSubmissionStatus] = useState<any>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    secondEmail: "",
    signposted: "",
    childName: "",
    childDOB: "",
    parentNames: "",
    siblings: "",
    address: "",
    phone: "",
    schoolName: "",
    schoolYear: "",
    diagnosis: "",
    diagnosisDate: "",
    medication: "",
    professionals: "",
    eligibility: "",
    interests: "",
    interestsBlob: "",
    communicateWithOthers: "",
    followInstructions: "",
    visualSupport: "",
    socialCommunication: "",
    highlyAnxious: "",
    recogniseEmotions: "",
    attendSchool: "",
    selfHarm: "",
    areasOfDifficulty: "",
    dailySkills: "",
    additionalSupport: "",
    consent: false,
  });

  const totalSteps = 4;

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

      console.log("Checking user status for session:", sessionId);
      try {
        const statusCheck = await checkFormSubmissionStatus(sessionId);
        console.log("Form submission status:", statusCheck);
        
        setFormSubmissionStatus(statusCheck);
        
        if (!statusCheck.success) {
          console.log("Status check failed:", statusCheck.error);
          setError(statusCheck.error || "Failed to verify session");
          setLoading(false);
          return;
        }
        
        if (statusCheck.alreadySubmitted) {
          console.log("Form already submitted, redirecting to submitted page");
          setAlreadySubmitted(true);
          setLoading(false);
          return;
        }
        
        if (!statusCheck.canSubmit) {
          console.log("User cannot submit form:", statusCheck.error);
          setError(statusCheck.error || "Not eligible to submit form");
          setLoading(false);
          return;
        }
        
        console.log("User can submit form, allowing access");
      } catch (err) {
        console.error("Error checking user status:", err);
        setError("Failed to verify session");
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [sessionId, router]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await submitReferralForm(sessionId, formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/submitted');
        }, 2000);
      } else {
        setError(result.error || "Failed to submit form");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading referral form...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Form Submitted Successfully!</h1>
          <p className="text-black">Redirecting you to confirmation page...</p>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Form Already Submitted</h1>
          <p className="text-black mb-6">This referral form has already been submitted for your session.</p>
          <button
            onClick={() => router.push('/submitted')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            View Submission Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <TestingNavigation currentPage="/referral-form" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Referral Application Form
            </h1>
            <p className="text-lg text-black">
              Congratulations! You've been selected to complete the referral form.
            </p>
            
            {/* Debug Info - Only show in testing/development mode */}
            {shouldShowDebugInfo() && formSubmissionStatus && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Session Status</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Can Submit:</strong> {formSubmissionStatus.canSubmit ? 'Yes' : 'No'}</p>
                  <p><strong>Already Submitted:</strong> {formSubmissionStatus.alreadySubmitted ? 'Yes' : 'No'}</p>
                  <p><strong>Session Status:</strong> {formSubmissionStatus.sessionStatus}</p>
                  <p><strong>Session ID:</strong> <code className="bg-blue-100 px-1 rounded">{sessionId}</code></p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-black">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-black mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <UserIcon className="h-4 w-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                      Secondary Email
                    </label>
                    <input
                      type="email"
                      value={formData.secondEmail}
                      onChange={(e) => handleInputChange('secondEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <PhoneIcon className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    How were you signposted to this service?
                  </label>
                  <input
                    type="text"
                    value={formData.signposted}
                    onChange={(e) => handleInputChange('signposted', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Child Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-black mb-6">Child Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Child&apos;s Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.childName}
                      onChange={(e) => handleInputChange('childName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.childDOB}
                      onChange={(e) => handleInputChange('childDOB', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Parent/Guardian Names
                  </label>
                  <input
                    type="text"
                    value={formData.parentNames}
                    onChange={(e) => handleInputChange('parentNames', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Siblings Information
                  </label>
                  <textarea
                    rows={3}
                    value={formData.siblings}
                    onChange={(e) => handleInputChange('siblings', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please provide details about any siblings, their ages, and any relevant information"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      School Year
                    </label>
                    <input
                      type="text"
                      value={formData.schoolYear}
                      onChange={(e) => handleInputChange('schoolYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-black mb-6">Medical & Assessment Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Diagnosis/Assessment Information
                  </label>
                  <textarea
                    rows={4}
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please provide details about any diagnoses, assessments, or evaluations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Diagnosis Date
                  </label>
                  <input
                    type="date"
                    value={formData.diagnosisDate}
                    onChange={(e) => handleInputChange('diagnosisDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Current Medication
                  </label>
                  <textarea
                    rows={3}
                    value={formData.medication}
                    onChange={(e) => handleInputChange('medication', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please list any current medications, dosages, and frequency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Healthcare Professionals Involved
                  </label>
                  <textarea
                    rows={3}
                    value={formData.professionals}
                    onChange={(e) => handleInputChange('professionals', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please list any doctors, therapists, or other healthcare professionals involved in your child's care"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Eligibility Information
                  </label>
                  <textarea
                    rows={3}
                    value={formData.eligibility}
                    onChange={(e) => handleInputChange('eligibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please provide any information about eligibility criteria or requirements"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Additional Information & Consent */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-black mb-6">Additional Information & Consent</h2>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Child&apos;s Interests and Strengths
                  </label>
                  <textarea
                    rows={4}
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please describe your child's interests, hobbies, strengths, and what they enjoy doing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Areas of Difficulty
                  </label>
                  <textarea
                    rows={4}
                    value={formData.areasOfDifficulty}
                    onChange={(e) => handleInputChange('areasOfDifficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please describe any areas where your child experiences difficulties or challenges"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Daily Living Skills
                  </label>
                  <textarea
                    rows={3}
                    value={formData.dailySkills}
                    onChange={(e) => handleInputChange('dailySkills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please describe your child's daily living skills and independence level"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Additional Support Needs
                  </label>
                  <textarea
                    rows={3}
                    value={formData.additionalSupport}
                    onChange={(e) => handleInputChange('additionalSupport', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please describe any additional support or accommodations your child may need"
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="consent" className="ml-3 text-sm text-black">
                      I consent to the processing of this information for the purpose of the referral application. 
                      I understand that this information will be used to assess eligibility and provide appropriate support services. *
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || !formData.consent}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReferralForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading referral form...</p>
        </div>
      </div>
    }>
      <FlowEnforcement requiredStatus="selected">
        <ReferralFormContent />
      </FlowEnforcement>
    </Suspense>
  );
}
