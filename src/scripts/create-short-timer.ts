import { config } from "dotenv";
import { getSql } from "@/lib/database";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function createShortCountdownTimer() {
  try {
    console.log("Creating short countdown timer (30 seconds)...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Please create a .env.local file with your database URL.");
    }
    
    const sql = getSql();
    
    // Create a countdown timer that ends in 30 seconds from now
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 1000); // 30 seconds from now
    
    console.log("Start time:", startTime.toISOString());
    console.log("End time:", endTime.toISOString());
    
    // First, deactivate any existing timers
    await sql`UPDATE countdown_timer SET is_active = false WHERE is_active = true;`;
    
    // Insert new countdown timer
    const result = await sql`
      INSERT INTO countdown_timer (start_time, end_time, is_active)
      VALUES (${startTime.toISOString()}, ${endTime.toISOString()}, true)
      RETURNING *;
    `;
    
    console.log("Short countdown timer created:", result[0]);
    
  } catch (error) {
    console.error("Error creating short countdown timer:", error);
    process.exit(1);
  }
}

createShortCountdownTimer();
