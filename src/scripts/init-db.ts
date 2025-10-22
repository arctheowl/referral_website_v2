import { config } from "dotenv";
import { createTables } from "@/lib/database";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined. Please create a .env.local file with your database URL.");
    }
    
    await createTables();
    console.log("Database initialized successfully!");
    console.log("Tables created:");
    console.log("- countdown_timer");
    console.log("- queue_management");
    console.log("- user_sessions");
    console.log("- referral_applications");
    console.log("- waitlist");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
