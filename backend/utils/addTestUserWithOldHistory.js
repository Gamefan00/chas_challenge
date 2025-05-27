import query from "./supabaseQuery.js";
import { v4 as uuidv4 } from "uuid";

async function addTestUserWithOldHistory(daysOld = 101) {
  try {
    // Generate a unique user ID
    const userId = `test-${uuidv4().substring(0, 8)}`;

    // Calculate the old date
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - daysOld);

    console.log(
      `Adding test user ${userId} with history from ${oldDate.toISOString()}`
    );

    // Create timestamps with slight variations
    const timestamps = [
      new Date(oldDate.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes before
      new Date(oldDate.getTime() - 1000 * 60 * 20).toISOString(), // 20 minutes before
      new Date(oldDate.getTime() - 1000 * 60 * 10).toISOString(), // 10 minutes before
      new Date(oldDate.getTime()).toISOString(), // base time
      new Date(oldDate.getTime() + 1000 * 60 * 10).toISOString(), // 10 minutes after
      new Date(oldDate.getTime() + 1000 * 60 * 20).toISOString(), // 20 minutes after
    ];

    // Insert application history records
    for (let i = 0; i < 3; i++) {
      const randomText = `App-${Math.random().toString(36).substring(2, 15)}`;
      await query(
        `INSERT INTO chat_histories_application_test (user_id, history, created_at, step_id)
         VALUES ($1, $2, $3, $4)`,
        [userId, randomText, timestamps[i], `step-${i + 1}`]
      );
    }

    // Insert interview history records
    for (let i = 0; i < 3; i++) {
      const randomText = `Int-${Math.random().toString(36).substring(2, 15)}`;
      await query(
        `INSERT INTO chat_histories_interview_test (user_id, history, created_at, step_id)
         VALUES ($1, $2, $3, $4)`,
        [userId, randomText, timestamps[i + 3], `step-${i + 1}`]
      );
    }

    console.log(
      `Successfully added test user ${userId} with 6 history records from ${daysOld} days ago`
    );
    console.log(
      `Run cleanup with threshold < ${daysOld} days to test deletion`
    );

    return {
      success: true,
      userId,
      timestamp: oldDate.toISOString(),
      message: `Test user created with data from ${daysOld} days ago`,
    };
  } catch (error) {
    console.error("Error adding test user:", error);
    return { success: false, error: error.message };
  }
}

// Allow passing days parameter from command line
const daysArg = process.argv[2] ? parseInt(process.argv[2]) : 101;

// Run if called directly
if (process.argv[1].includes("addTestUserWithOldHistory.js")) {
  addTestUserWithOldHistory(daysArg)
    .then((result) => {
      console.log(result);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { addTestUserWithOldHistory };
