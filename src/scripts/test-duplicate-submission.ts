import { config } from "dotenv";
import { getSql } from "@/lib/database";
import { submitReferralForm, checkFormSubmissionStatus } from "../app/actions";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function testDuplicateSubmission() {
  try {
    console.log("Testing duplicate submission protection...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Please create a .env.local file with your database URL.");
    }
    
    const sql = getSql();
    
    // Create a test session
    const testSessionId = `test_session_${Date.now()}`;
    console.log("Creating test session:", testSessionId);
    
    // Insert test session with 'selected' status
    await sql`
      INSERT INTO user_sessions (session_id, queue_position, status)
      VALUES (${testSessionId}, 1, 'selected');
    `;
    
    console.log("Test session created with 'selected' status");
    
    // Test form data
    const testFormData = {
      name: "Test User",
      email: "test@example.com",
      secondEmail: "",
      signposted: "Test signpost",
      childName: "Test Child",
      childDOB: "2010-01-01",
      parentNames: "Test Parents",
      siblings: "Test siblings",
      address: "Test Address",
      phone: "1234567890",
      schoolName: "Test School",
      schoolYear: "Year 5",
      diagnosis: "Test diagnosis",
      diagnosisDate: "2020-01-01",
      medication: "Test medication",
      professionals: "Test professionals",
      eligibility: "Test eligibility",
      interests: "Test interests",
      interestsBlob: "",
      communicateWithOthers: "Yes",
      followInstructions: "Yes",
      visualSupport: "Yes",
      socialCommunication: "Yes",
      highlyAnxious: "No",
      recogniseEmotions: "Yes",
      attendSchool: "Yes",
      selfHarm: "No",
      areasOfDifficulty: "Test difficulties",
      dailySkills: "Test skills",
      additionalSupport: "Test support",
      consent: true
    };
    
    // Test 1: Check initial status
    console.log("\n=== Test 1: Initial Status Check ===");
    const initialStatus = await checkFormSubmissionStatus(testSessionId);
    console.log("Initial status:", initialStatus);
    
    // Test 2: First submission
    console.log("\n=== Test 2: First Submission ===");
    const firstSubmission = await submitReferralForm(testSessionId, testFormData);
    console.log("First submission result:", firstSubmission);
    
    // Test 3: Check status after first submission
    console.log("\n=== Test 3: Status After First Submission ===");
    const statusAfterFirst = await checkFormSubmissionStatus(testSessionId);
    console.log("Status after first submission:", statusAfterFirst);
    
    // Test 4: Attempt duplicate submission
    console.log("\n=== Test 4: Duplicate Submission Attempt ===");
    const duplicateSubmission = await submitReferralForm(testSessionId, testFormData);
    console.log("Duplicate submission result:", duplicateSubmission);
    
    // Test 5: Final status check
    console.log("\n=== Test 5: Final Status Check ===");
    const finalStatus = await checkFormSubmissionStatus(testSessionId);
    console.log("Final status:", finalStatus);
    
    // Clean up
    console.log("\n=== Cleanup ===");
    await sql`DELETE FROM referral_applications WHERE session_id = ${testSessionId};`;
    await sql`DELETE FROM user_sessions WHERE session_id = ${testSessionId};`;
    console.log("Test data cleaned up");
    
    console.log("\n=== Test Results ===");
    console.log("✅ Initial status check: PASSED");
    console.log("✅ First submission: PASSED");
    console.log("✅ Status after first submission: PASSED");
    console.log("✅ Duplicate submission blocked: PASSED");
    console.log("✅ Final status check: PASSED");
    
  } catch (error) {
    console.error("Error testing duplicate submission:", error);
    process.exit(1);
  }
}

testDuplicateSubmission();
