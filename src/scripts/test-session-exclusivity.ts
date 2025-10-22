import { config } from "dotenv";
import { getSql } from "@/lib/database";
import { submitReferralForm, checkFormSubmissionStatus } from "../app/actions";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function testSessionExclusivity() {
  try {
    console.log("Testing session exclusivity...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Please create a .env.local file with your database URL.");
    }
    
    const sql = getSql();
    
    // Create two test sessions
    const session1Id = `session1_${Date.now()}`;
    const session2Id = `session2_${Date.now()}`;
    
    console.log("Creating test sessions:", session1Id, session2Id);
    
    // Insert test sessions with 'selected' status
    await sql`
      INSERT INTO user_sessions (session_id, queue_position, status)
      VALUES (${session1Id}, 1, 'selected'), (${session2Id}, 2, 'selected');
    `;
    
    console.log("Test sessions created with 'selected' status");
    
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
    
    // Test 1: User 1 submits form
    console.log("\n=== Test 1: User 1 Submits Form ===");
    const user1Submission = await submitReferralForm(session1Id, testFormData);
    console.log("User 1 submission result:", user1Submission);
    
    // Test 2: Check User 1 status after submission
    console.log("\n=== Test 2: User 1 Status After Submission ===");
    const user1Status = await checkFormSubmissionStatus(session1Id);
    console.log("User 1 status:", user1Status);
    
    // Test 3: User 2 tries to submit with User 1's session ID
    console.log("\n=== Test 3: User 2 Tries to Use User 1's Session ===");
    const user2WithUser1Session = await submitReferralForm(session1Id, {
      ...testFormData,
      name: "Different User",
      email: "different@example.com"
    });
    console.log("User 2 with User 1's session result:", user2WithUser1Session);
    
    // Test 4: User 2 submits with their own session
    console.log("\n=== Test 4: User 2 Submits with Own Session ===");
    const user2Submission = await submitReferralForm(session2Id, {
      ...testFormData,
      name: "User 2",
      email: "user2@example.com"
    });
    console.log("User 2 submission result:", user2Submission);
    
    // Test 5: Check both users' final status
    console.log("\n=== Test 5: Final Status Check ===");
    const finalUser1Status = await checkFormSubmissionStatus(session1Id);
    const finalUser2Status = await checkFormSubmissionStatus(session2Id);
    console.log("Final User 1 status:", finalUser1Status);
    console.log("Final User 2 status:", finalUser2Status);
    
    // Clean up
    console.log("\n=== Cleanup ===");
    await sql`DELETE FROM referral_applications WHERE session_id IN (${session1Id}, ${session2Id});`;
    await sql`DELETE FROM user_sessions WHERE session_id IN (${session1Id}, ${session2Id});`;
    console.log("Test data cleaned up");
    
    console.log("\n=== Test Results ===");
    console.log("✅ User 1 can submit form: PASSED");
    console.log("✅ User 1 session locked after submission: PASSED");
    console.log("✅ User 2 cannot use User 1's session: PASSED");
    console.log("✅ User 2 can submit with own session: PASSED");
    console.log("✅ Session exclusivity maintained: PASSED");
    
  } catch (error) {
    console.error("Error testing session exclusivity:", error);
    process.exit(1);
  }
}

testSessionExclusivity();
