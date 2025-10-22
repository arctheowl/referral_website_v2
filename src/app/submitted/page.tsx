"use client";

import { CheckCircleIcon, DocumentTextIcon, ClockIcon, PhoneIcon } from "@heroicons/react/24/outline";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";

export default function Submitted() {
  return (
    <FlowEnforcement requiredStatus="completed">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <TestingNavigation currentPage="/submitted" />
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-black mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-black">
              Thank you for completing the referral application. Your information has been received and is being processed.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-6">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-semibold text-black">Application Review</h3>
                  <p className="text-black text-sm">
                    Our team will review your application and assess eligibility for the program.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-semibold text-black">Processing Time</h3>
                  <p className="text-black text-sm">
                    Please allow 5-10 business days for initial review and response.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-semibold text-black">Contact & Follow-up</h3>
                  <p className="text-black text-sm">
                    We will contact you via email or phone to discuss next steps and program details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li>• Keep your contact information up to date</li>
              <li>• Check your email regularly for updates</li>
              <li>• Save this confirmation for your records</li>
              <li>• Contact us if you have any questions or need to update your information</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-black mb-4">Need Help or Have Questions?</h3>
            <div className="space-y-2 text-sm text-black">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800">
                  support@example.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+441234567890" className="text-blue-600 hover:text-blue-800">
                  01234 567 890
                </a>
              </p>
              <p>
                <strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-sm text-black">
            <p>
              Thank you for your interest in our referral program. We look forward to supporting you and your family.
            </p>
          </div>
        </div>
        </div>
      </div>
    </FlowEnforcement>
  );
}
