import { neon } from "@neondatabase/serverless";

export const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined. Please set it in your .env.local file");
  }
  return neon(process.env.DATABASE_URL);
};

// Database schema for v2 referral system
export const createTables = async () => {
  const sql = getSql();
  
  // Countdown timer table
  await sql`
    CREATE TABLE IF NOT EXISTS countdown_timer (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Queue management table
  await sql`
    CREATE TABLE IF NOT EXISTS queue_management (
      id SERIAL PRIMARY KEY,
      max_users INTEGER DEFAULT 50,
      current_users INTEGER DEFAULT 0,
      queue_position INTEGER DEFAULT 0,
      is_open BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // User sessions table
  await sql`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      queue_position INTEGER,
      status VARCHAR(50) DEFAULT 'waiting', -- 'waiting', 'selected', 'rejected', 'completed'
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      selected_at TIMESTAMP,
      completed_at TIMESTAMP
    );
  `;

  // Referral applications table (for selected users)
  await sql`
    CREATE TABLE IF NOT EXISTS referral_applications (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) REFERENCES user_sessions(session_id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      second_email VARCHAR(255),
      signposted VARCHAR(255),
      child_name VARCHAR(255) NOT NULL,
      child_dob DATE NOT NULL,
      parent_names VARCHAR(255),
      siblings TEXT,
      address TEXT,
      phone VARCHAR(50),
      school_name VARCHAR(255),
      school_year VARCHAR(50),
      diagnosis TEXT,
      diagnosis_date DATE,
      medication TEXT,
      professionals TEXT,
      eligibility TEXT,
      interests TEXT,
      interests_blob TEXT,
      communicate_with_others TEXT,
      follow_instructions TEXT,
      visual_support TEXT,
      social_communication TEXT,
      highly_anxious TEXT,
      recognise_emotions TEXT,
      attend_school TEXT,
      self_harm TEXT,
      areas_of_difficulty TEXT,
      daily_skills TEXT,
      additional_support TEXT,
      consent BOOLEAN NOT NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Waitlist table (for rejected users)
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) REFERENCES user_sessions(session_id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      postcode VARCHAR(20),
      child_dob DATE,
      child_name VARCHAR(255),
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Eligibility check table (pre-screening before waiting room)
  await sql`
    CREATE TABLE IF NOT EXISTS eligibility_checks (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      school_year VARCHAR(50) NOT NULL,
      catchment_town VARCHAR(255) NOT NULL,
      can_attend_hospital BOOLEAN NOT NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Initialize default values
  await sql`
    INSERT INTO countdown_timer (start_time, end_time, is_active)
    VALUES (NOW(), NOW() + INTERVAL '1 hour', true)
    ON CONFLICT DO NOTHING;
  `;

  await sql`
    INSERT INTO queue_management (max_users, current_users, queue_position, is_open)
    VALUES (50, 0, 0, false)
    ON CONFLICT DO NOTHING;
  `;
};
