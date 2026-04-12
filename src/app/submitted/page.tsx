"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import FlowEnforcement from "@/components/FlowEnforcement";

export default function SubmittedPage() {
  return (
    <FlowEnforcement requiredStatus="completed">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col items-center justify-center lg:col-span-1 min-h-[200px] lg:min-h-[80vh]">
            <img
              src="/MustardSeed_Primary-Logo.png"
              alt="Mustard Seed"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-2">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-black mb-4">You&apos;re all set</h1>
                <p className="text-lg text-black">
                  Your details are on file with us from an earlier step in this process.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-left">
                <h2 className="text-2xl font-semibold text-black mb-6">What happens next</h2>
                <ul className="space-y-4 text-black text-sm list-disc list-inside">
                  <li>We will be in touch with you by email using the address you provided.</li>
                  <li>Within the next month we will carry out an Initial Needs Assessment with you (usually over the phone).</li>
                  <li>
                    Our team will meet to determine what type of support we can offer your family. This may look like:
                    <ul className="mt-2 ml-4 space-y-1 list-disc list-inside text-gray-700">
                      <li>parent course / workshops / 1-1 support</li>
                      <li>direct work with you and your child - either 1-1 or in small group</li>
                      <li>provision of resources, loan of equipment and books</li>
                    </ul>
                  </li>
                  <li>
                    We will email you to discuss the next steps and timings. As we are a small team we will not be able
                    to see all the families immediately, but will let you know the plan.
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>
                    • There is no need to contact us, we will be in touch via email - please check regularly (including
                    junk box!).
                  </li>
                  <li>• If your contact details change please do let us know.</li>
                  <li>
                    • For more information please see our website:{" "}
                    <a
                      href="https://mustardseedautism.co.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      https://mustardseedautism.co.uk/
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowEnforcement>
  );
}
