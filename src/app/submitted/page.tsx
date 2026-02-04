"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import TestingNavigation from "@/components/TestingNavigation";
import FlowEnforcement from "@/components/FlowEnforcement";

export default function Submitted() {
  return (
    <FlowEnforcement requiredStatus="completed">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <TestingNavigation currentPage="/submitted" />
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success */}
          <div className="mb-8">
            <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-black mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-black">
              Your information has been received and is being processed.
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-black mb-6">What Happens Next</h2>
            <ul className="space-y-4 text-black text-sm list-disc list-inside">
              <li>You will be emailed our Referral Form tomorrow.</li>
              <li>Please complete and submit it within 48 hours.</li>
              <li>Within the next month we will carry out an Initial Needs Assessment with you (usually over the phone).</li>
              <li>Our team will meet to determine what type of support we can offer your family. This may look like:
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside text-gray-700">
                  <li>parent course / workshops / 1-1 support</li>
                  <li>direct work with you and your child - either 1-1 or in small group</li>
                  <li>provision of resources, loan of equipment and books</li>
                </ul>
              </li>
              <li>We will email you to discuss the next steps and timings. As we are a small team we will not be able to see all the families immediately, but will let you know the plan.</li>
            </ul>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• There is no need to contact us, we will be in touch via email - please check regularly (including junk box!).</li>
              <li>• If your contact details change please do let us know.</li>
              <li>• For more information please see our website: <a href="https://mustardseedautism.co.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">https://mustardseedautism.co.uk/</a></li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </FlowEnforcement>
  );
}
