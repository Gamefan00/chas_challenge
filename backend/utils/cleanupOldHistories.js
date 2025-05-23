import query from "./supabaseQuery.js";

// Function to delete histories older than specified days
export async function cleanupOldUserHistories(daysThreshold = 100) {
  console.log(
    `Starting cleanup of user histories older than ${daysThreshold} days`
  );

  try {
    // Calculate the cutoff date (current date minus threshold days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
    const cutoffDateString = cutoffDate.toISOString();

    console.log(`Cutoff date: ${cutoffDateString}`);

    // Get all distinct user IDs from both tables
    const userIdsResult = await query(`
      SELECT DISTINCT user_id FROM (
        SELECT user_id FROM chat_histories_application_test
        UNION
        SELECT user_id FROM chat_histories_interview_test
      ) AS combined_users`);

    const userIds = userIdsResult.map((row) => row.user_id);
    console.log(`Found ${userIds.length} users to check`);

    let deletedUsers = 0;

    // Check each user
    for (const userId of userIds) {
      // Check if all application history entries are older than the threshold
      const appStepCountResult = await query(
        `
        SELECT COUNT(*) as total_steps FROM chat_histories_application_test
        WHERE user_id = $1`,
        [userId]
      );

      const appOldStepCountResult = await query(
        `
        SELECT COUNT(*) as old_steps FROM chat_histories_application_test
        WHERE user_id = $1 AND created_at < $2`,
        [userId, cutoffDateString]
      );

      // Check if all interview history entries are older than the threshold
      const intStepCountResult = await query(
        `
        SELECT COUNT(*) as total_steps FROM chat_histories_interview_test
        WHERE user_id = $1`,
        [userId]
      );

      const intOldStepCountResult = await query(
        `
        SELECT COUNT(*) as old_steps FROM chat_histories_interview_test
        WHERE user_id = $1 AND created_at < $2`,
        [userId, cutoffDateString]
      );

      const appTotalSteps = parseInt(appStepCountResult[0]?.total_steps || 0);
      const appOldSteps = parseInt(appOldStepCountResult[0]?.old_steps || 0);
      const intTotalSteps = parseInt(intStepCountResult[0]?.total_steps || 0);
      const intOldSteps = parseInt(intOldStepCountResult[0]?.old_steps || 0);

      // If user has records and ALL records are old in BOTH tables
      if (
        (appTotalSteps === 0 || appTotalSteps === appOldSteps) &&
        (intTotalSteps === 0 || intTotalSteps === intOldSteps)
      ) {
        // Only delete if the user has at least some history
        if (appTotalSteps > 0 || intTotalSteps > 0) {
          console.log(
            `Deleting all history for user ${userId} - all entries are older than ${daysThreshold} days`
          );

          // Delete from application history
          if (appTotalSteps > 0) {
            await query(
              `DELETE FROM chat_histories_application_test WHERE user_id = $1`,
              [userId]
            );
          }

          // Delete from interview history
          if (intTotalSteps > 0) {
            await query(
              `DELETE FROM chat_histories_interview_test WHERE user_id = $1`,
              [userId]
            );
          }

          deletedUsers++;
        }
      }
    }

    console.log(
      `Cleanup completed. Removed histories for ${deletedUsers} users.`
    );
    return { success: true, deletedUsers };
  } catch (error) {
    console.error("Error during history cleanup:", error);
    return { success: false, error: error.message };
  }
}

// Run directly if called from command line
if (process.argv[1].includes("cleanupOldHistories.js")) {
  cleanupOldUserHistories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
