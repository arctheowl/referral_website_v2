import { config } from "dotenv";
import { getSql } from "@/lib/database";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function createCountdownTimer() {
  try {
    console.log("Creating countdown timer...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Please create a .env.local file with your database URL.");
    }
    
    const sql = getSql();
    
    // Create a countdown timer that ends in 1 hour from now
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    console.log("Start time:", startTime.toISOString());
    console.log("End time:", endTime.toISOString());
    
    // Insert countdown timer
    const result = await sql`
      INSERT INTO countdown_timer (start_time, end_time, is_active)
      VALUES (${startTime.toISOString()}, ${endTime.toISOString()}, true)
      RETURNING *;
    `;
    
    console.log("Countdown timer created:", result[0]);
    
    // Also create queue management entry
    const queueResult = await sql`
      INSERT INTO queue_management (max_users, current_users, queue_position, is_open)
      VALUES (50, 0, 0, true)
      RETURNING *;
    `;
    
    console.log("Queue management created:", queueResult[0]);
    
  } catch (error) {
    console.error("Error creating countdown timer:", error);
    process.exit(1);
  }
}

createCountdownTimer();
