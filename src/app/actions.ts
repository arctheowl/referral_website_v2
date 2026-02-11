"use server";

import { getSql } from "@/lib/database";
import { revalidatePath } from "next/cache";

// Countdown timer actions
export async function getCountdownTimer() {
  try {
    const sql = getSql();
    const data = await sql`SELECT * FROM countdown_timer WHERE is_active = true ORDER BY created_at DESC LIMIT 1;`;
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching countdown timer:", error);
    return null;
  }
}

export async function updateCountdownTimer(startTime: string, endTime: string) {
  try {
    const sql = getSql();
    await sql`
      UPDATE countdown_timer 
      SET start_time = ${startTime}, end_time = ${endTime},
          selection_status = NULL, selected_at = NULL,
          updated_at = CURRENT_TIMESTAMP 
      WHERE is_active = true;
    `;
    return { success: true };
  } catch (error) {
    console.error("Error updating countdown timer:", error);
    return { success: false, error: "Failed to update timer" };
  }
}

// Queue management actions
export async function getQueueStatus() {
  try {
    const sql = getSql();
    const data = await sql`SELECT * FROM queue_management ORDER BY updated_at DESC LIMIT 1;`;
    if (data.length) return data[0];
    // No row exists (e.g. init not run or table empty): create default so the app can run
    const inserted = await sql`
      INSERT INTO queue_management (max_users, current_users, queue_position, is_open)
      VALUES (40, 0, 0, true)
      RETURNING *;
    `;
    return inserted[0] || null;
  } catch (error) {
    console.error("Error fetching queue status:", error);
    return null;
  }
}

export async function openQueue() {
  try {
    const sql = getSql();
    await sql`UPDATE queue_management SET is_open = true, updated_at = CURRENT_TIMESTAMP;`;
    return { success: true };
  } catch (error) {
    console.error("Error opening queue:", error);
    return { success: false, error: "Failed to open queue" };
  }
}

export async function closeQueue() {
  try {
    const sql = getSql();
    await sql`UPDATE queue_management SET is_open = false, updated_at = CURRENT_TIMESTAMP;`;
    return { success: true };
  } catch (error) {
    console.error("Error closing queue:", error);
    return { success: false, error: "Failed to close queue" };
  }
}

// User session actions
export async function createUserSession(sessionId: string) {
  try {
    const sql = getSql();
    
    // Check if session already exists
    const existingSession = await sql`
      SELECT * FROM user_sessions WHERE session_id = ${sessionId};
    `;
    
    if (existingSession.length > 0) {
      // Session already exists, return existing position
      return { 
        success: true, 
        queuePosition: existingSession[0].queue_position,
        existing: true 
      };
    }
    
    const queueStatus = await getQueueStatus();
    if (!queueStatus) {
      return { success: false, error: "Queue status not found" };
    }

    const queuePosition = queueStatus.queue_position + 1;
    
    await sql`
      INSERT INTO user_sessions (session_id, queue_position, status)
      VALUES (${sessionId}, ${queuePosition}, 'waiting');
    `;

    await sql`
      UPDATE queue_management 
      SET queue_position = ${queuePosition}, updated_at = CURRENT_TIMESTAMP;
    `;

    return { success: true, queuePosition, existing: false };
  } catch (error) {
    console.error("Error creating user session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

export async function getUserSession(sessionId: string) {
  try {
    const sql = getSql();
    const data = await sql`SELECT * FROM user_sessions WHERE session_id = ${sessionId};`;
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}

export async function selectUsersForReferral() {
  try {
    const sql = getSql();
    const timer = await getCountdownTimer();
    if (!timer) {
      return { success: false, error: "Countdown timer not found" };
    }

    // If selection was already run for this countdown, do nothing (only one run per countdown)
    if (timer.selection_status) {
      return { success: true, selectedCount: 0, alreadyRun: true };
    }

    // Atomic claim on countdown_timer: only one caller can set selection_status/selected_at; others get 0 rows
    const claimed = await sql`
      UPDATE countdown_timer
      SET selection_status = 'completed', selected_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${timer.id} AND (selection_status IS NULL OR selection_status = '')
      RETURNING id;
    `;
    if (claimed.length === 0) {
      return { success: true, selectedCount: 0, alreadyRun: true };
    }

    const queueStatus = await getQueueStatus();
    if (!queueStatus) {
      return { success: false, error: "Queue status not found" };
    }
    const maxUsers = queueStatus.max_users ?? 4;

    // Randomly select up to max_users from everyone in the waiting room (not first-come-first-served)
    const selectedUsers = await sql`
      WITH chosen AS (
        SELECT session_id
        FROM user_sessions
        WHERE status = 'waiting'
        ORDER BY random()
        LIMIT ${maxUsers}
      )
      UPDATE user_sessions us
      SET status = 'selected', selected_at = CURRENT_TIMESTAMP
      FROM chosen c
      WHERE us.session_id = c.session_id
      RETURNING us.session_id, us.queue_position;
    `;

    // Mark all remaining waiting users as rejected
    await sql`
      UPDATE user_sessions
      SET status = 'rejected'
      WHERE status = 'waiting';
    `;

    // Update eligibility_checks with selection outcome (null/blank → 'selected' or 'rejected')
    // Use explicit subqueries so every user_session with selected/rejected gets their eligibility row updated
    await sql`
      UPDATE eligibility_checks
      SET selection_status = 'selected'
      WHERE session_id IN (SELECT session_id FROM user_sessions WHERE status = 'selected')
        AND (selection_status IS NULL OR selection_status = '');
    `;
    await sql`
      UPDATE eligibility_checks
      SET selection_status = 'rejected'
      WHERE session_id IN (SELECT session_id FROM user_sessions WHERE status = 'rejected')
        AND (selection_status IS NULL OR selection_status = '');
    `;

    // Update queue management counts (still used for max_users and display)
    await sql`
      UPDATE queue_management
      SET current_users = ${selectedUsers.length}, is_open = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${queueStatus.id};
    `;

    return { success: true, selectedCount: selectedUsers.length };
  } catch (error) {
    console.error("Error selecting users:", error);
    return { success: false, error: "Failed to select users" };
  }
}

// Referral form actions
export async function submitReferralForm(sessionId: string, formData: Record<string, any>) {
  try {
    const sql = getSql();
    
    // First, check if user session exists and is eligible
    const userSession = await getUserSession(sessionId);
    if (!userSession) {
      return { success: false, error: "Session not found" };
    }
    
    if (userSession.status !== 'selected') {
      return { success: false, error: `User not eligible for referral form. Current status: ${userSession.status}` };
    }
    
    // Check if a referral application already exists for this session
    const existingApplication = await sql`
      SELECT id FROM referral_applications WHERE session_id = ${sessionId};
    `;
    
    if (existingApplication.length > 0) {
      return { success: false, error: "Referral form has already been submitted for this session" };
    }
    
    // Check if session is already completed
    if (userSession.status === 'completed') {
      return { success: false, error: "This session has already been completed" };
    }

    // Insert the referral application
    await sql`
      INSERT INTO referral_applications (
        session_id, name, email, second_email, signposted, child_name, child_dob,
        parent_names, siblings, address, phone, school_name, school_year,
        diagnosis, diagnosis_date, medication, professionals, eligibility,
        interests, interests_blob, communicate_with_others, follow_instructions,
        visual_support, social_communication, highly_anxious, recognise_emotions,
        attend_school, self_harm, areas_of_difficulty, daily_skills,
        additional_support, consent
      ) VALUES (
        ${sessionId}, ${formData.name}, ${formData.email}, ${formData.secondEmail},
        ${formData.signposted}, ${formData.childName}, ${formData.childDOB},
        ${formData.parentNames}, ${formData.siblings}, ${formData.address},
        ${formData.phone}, ${formData.schoolName}, ${formData.schoolYear},
        ${formData.diagnosis}, ${formData.diagnosisDate}, ${formData.medication},
        ${formData.professionals}, ${formData.eligibility}, ${formData.interests},
        ${formData.interestsBlob}, ${formData.communicateWithOthers},
        ${formData.followInstructions}, ${formData.visualSupport},
        ${formData.socialCommunication}, ${formData.highlyAnxious},
        ${formData.recogniseEmotions}, ${formData.attendSchool}, ${formData.selfHarm},
        ${formData.areasOfDifficulty}, ${formData.dailySkills},
        ${formData.additionalSupport}, ${formData.consent}
      );
    `;

    // Mark user session as completed (this prevents further submissions)
    await sql`
      UPDATE user_sessions 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE session_id = ${sessionId} AND status = 'selected';
    `;

    return { success: true };
  } catch (error) {
    console.error("Error submitting referral form:", error);
    return { success: false, error: "Failed to submit form" };
  }
}

// Waitlist actions
export async function addToWaitlist(sessionId: string, waitlistData: Record<string, any>) {
  try {
    const sql = getSql();
    const userSession = await getUserSession(sessionId);
    if (!userSession) {
      return { success: false, error: "User session not found" };
    }

    await sql`
      INSERT INTO waitlist (session_id, name, email, postcode, child_dob, child_name)
      VALUES (${sessionId}, ${waitlistData.name}, ${waitlistData.email}, 
              ${waitlistData.postcode}, ${waitlistData.childDOB}, ${waitlistData.childName});
    `;

    return { success: true };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { success: false, error: "Failed to add to waitlist" };
  }
}

// Admin actions
export async function getReferralApplications() {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT ra.*, us.queue_position, us.selected_at
      FROM referral_applications ra
      JOIN user_sessions us ON ra.session_id = us.session_id
      ORDER BY ra.submitted_at DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching referral applications:", error);
    return [];
  }
}

export async function getWaitlistEntries() {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT w.*, us.queue_position, us.joined_at
      FROM waitlist w
      JOIN user_sessions us ON w.session_id = us.session_id
      ORDER BY w.added_at DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return [];
  }
}

export async function getTotalUniqueUsers() {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT COUNT(DISTINCT session_id) as unique_users
      FROM user_sessions;
    `;
    return data[0]?.unique_users || 0;
  } catch (error) {
    console.error("Error fetching total unique users:", error);
    return 0;
  }
}

export async function checkFormSubmissionStatus(sessionId: string) {
  try {
    const sql = getSql();
    
    // Check if user session exists
    const userSession = await getUserSession(sessionId);
    if (!userSession) {
      return { 
        success: false, 
        error: "Session not found",
        canSubmit: false,
        alreadySubmitted: false,
        sessionStatus: null
      };
    }
    
    // Check if form has already been submitted
    const existingApplication = await sql`
      SELECT id FROM referral_applications WHERE session_id = ${sessionId};
    `;
    
    const alreadySubmitted = existingApplication.length > 0;
    const canSubmit = userSession.status === 'selected' && !alreadySubmitted;
    
    return {
      success: true,
      canSubmit,
      alreadySubmitted,
      sessionStatus: userSession.status,
      error: canSubmit ? null : 
        alreadySubmitted ? "Form has already been submitted" :
        userSession.status !== 'selected' ? `User not eligible. Status: ${userSession.status}` :
        "Unknown error"
    };
  } catch (error) {
    console.error("Error checking form submission status:", error);
    return { 
      success: false, 
      error: "Failed to check submission status",
      canSubmit: false,
      alreadySubmitted: false,
      sessionStatus: null
    };
  }
}

// Eligibility check actions
export async function submitEligibilityCheck(
  sessionId: string,
  eligibilityData: {
    parentName: string;
    primaryEmail: string;
    secondaryEmail?: string;
    diagnosis: string;
    schoolYear: string;
    catchmentTown: string;
    canAttendHospital: boolean;
  }
) {
  try {
    const sql = getSql();

    // Check if eligibility already exists
    const existing = await sql`
      SELECT id FROM eligibility_checks WHERE session_id = ${sessionId};
    `;

    if (existing.length > 0) {
      return { success: true, alreadySubmitted: true };
    }

    // Insert eligibility check
    await sql`
      INSERT INTO eligibility_checks (session_id, parent_name, primary_email, secondary_email, diagnosis, school_year, catchment_town, can_attend_hospital)
      VALUES (${sessionId}, ${eligibilityData.parentName}, ${eligibilityData.primaryEmail}, ${eligibilityData.secondaryEmail ?? null}, ${eligibilityData.diagnosis}, ${eligibilityData.schoolYear}, ${eligibilityData.catchmentTown}, ${eligibilityData.canAttendHospital});
    `;

    return { success: true, alreadySubmitted: false };
  } catch (error) {
    console.error("Error submitting eligibility check:", error);
    return { success: false, error: "Failed to submit eligibility check" };
  }
}

export async function checkEligibilityStatus(sessionId: string) {
  try {
    const sql = getSql();
    const data = await sql`
      SELECT * FROM eligibility_checks WHERE session_id = ${sessionId};
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Error checking eligibility status:", error);
    return null;
  }
}