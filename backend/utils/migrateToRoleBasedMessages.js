import query from "./supabaseQuery.js";

async function migrateToRoleBasedMessages() {
  console.log("Starting migration to role-based messages...");

  try {
    // Get current applicationSteps
    const appStepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSteps"]
    );

    if (appStepsResult && appStepsResult.length > 0) {
      let appStepsData = appStepsResult[0].value;

      // Parse if needed
      if (typeof appStepsData === "string") {
        try {
          appStepsData = JSON.parse(appStepsData);
        } catch (e) {
          console.error("Error parsing applicationSteps:", e);
          return;
        }
      }

      // Convert to role-based format
      const updatedAppSteps = {};

      for (const [stepId, stepData] of Object.entries(appStepsData)) {
        if (stepData.welcome && !stepData.welcomeArbetstagare) {
          // Migrate old format to new format
          updatedAppSteps[stepId] = {
            welcomeArbetstagare: stepData.welcome,
            welcomeArbetsgivare: stepData.welcome, // Use same message initially
            description: stepData.description || "",
          };
          console.log(`Migrated application step ${stepId}`);
        } else if (stepData.welcomeArbetstagare) {
          // Already in new format
          updatedAppSteps[stepId] = stepData;
        } else {
          // Create default structure
          updatedAppSteps[stepId] = {
            welcomeArbetstagare: "",
            welcomeArbetsgivare: "",
            description: stepData.description || "",
          };
        }
      }

      // Update database
      await query(`UPDATE admin_settings SET value = $1 WHERE key = $2`, [
        JSON.stringify(updatedAppSteps),
        "applicationSteps",
      ]);

      console.log("✅ Application steps migrated successfully");
    } else {
      console.log("No applicationSteps found in database");
    }

    // Get current interviewSteps
    const interviewStepsResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["interviewSteps"]
    );

    if (interviewStepsResult && interviewStepsResult.length > 0) {
      let interviewStepsData = interviewStepsResult[0].value;

      // Parse if needed
      if (typeof interviewStepsData === "string") {
        try {
          interviewStepsData = JSON.parse(interviewStepsData);
        } catch (e) {
          console.error("Error parsing interviewSteps:", e);
          return;
        }
      }

      // Convert to role-based format
      const updatedInterviewSteps = {};

      for (const [stepId, stepData] of Object.entries(interviewStepsData)) {
        if (stepData.welcome && !stepData.welcomeArbetstagare) {
          // Migrate old format to new format
          updatedInterviewSteps[stepId] = {
            welcomeArbetstagare: stepData.welcome,
            welcomeArbetsgivare: stepData.welcome, // Use same message initially
            description: stepData.description || "",
          };
          console.log(`Migrated interview step ${stepId}`);
        } else if (stepData.welcomeArbetstagare) {
          // Already in new format
          updatedInterviewSteps[stepId] = stepData;
        } else {
          // Create default structure
          updatedInterviewSteps[stepId] = {
            welcomeArbetstagare: "",
            welcomeArbetsgivare: "",
            description: stepData.description || "",
          };
        }
      }

      // Update database
      await query(`UPDATE admin_settings SET value = $1 WHERE key = $2`, [
        JSON.stringify(updatedInterviewSteps),
        "interviewSteps",
      ]);

      console.log("✅ Interview steps migrated successfully");
    } else {
      console.log("No interviewSteps found in database");
    }

    // Update system messages to include role-based instructions if they don't already have them
    const appSystemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["applicationSystemMessage"]
    );

    if (appSystemResult && appSystemResult.length > 0) {
      const currentMessage = appSystemResult[0].value;

      // Check if it already contains role-based instructions
      if (
        !currentMessage.includes("ARBETSTAGARE INSTRUKTIONER") &&
        !currentMessage.includes("ARBETSGIVARE INSTRUKTIONER")
      ) {
        const enhancedMessage = `${currentMessage}

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som ansöker för sig själv):
- Använd blankett FK 7545
- Fokusera på personliga behov och funktionsnedsättning
- Vägled genom personlig ansökan
- Hjälp med att beskriva egen arbetssituation

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (ansöker för en anställd):
- Använd blankett FK 7546
- Fokusera på anpassningar av arbetsplatsen
- Vägled genom ansökan för anställd
- Hjälp med att beskriva arbetsmiljön`;

        await query(`UPDATE admin_settings SET value = $1 WHERE key = $2`, [
          enhancedMessage,
          "applicationSystemMessage",
        ]);

        console.log(
          "✅ Application system message enhanced with role-based instructions"
        );
      } else {
        console.log(
          "Application system message already contains role-based instructions"
        );
      }
    }

    const interviewSystemResult = await query(
      "SELECT value FROM admin_settings WHERE key = $1",
      ["interviewSystemMessage"]
    );

    if (interviewSystemResult && interviewSystemResult.length > 0) {
      const currentMessage = interviewSystemResult[0].value;

      // Check if it already contains role-based instructions
      if (
        !currentMessage.includes("ARBETSTAGARE INSTRUKTIONER") &&
        !currentMessage.includes("ARBETSGIVARE INSTRUKTIONER")
      ) {
        const enhancedMessage = `${currentMessage}

VIKTIGT: Identifiera först om användaren är Arbetstagare eller Arbetsgivare baserat på deras svar.

=== ARBETSTAGARE INSTRUKTIONER ===
Om användaren är en arbetstagare (anställd som behöver hjälp):
- Ställ personliga frågor om funktionsnedsättning
- Fokusera på individuella behov och utmaningar
- Fråga om personliga erfarenheter av arbetet
- Hjälp att formulera egna behov

=== ARBETSGIVARE INSTRUKTIONER ===
Om användaren är en arbetsgivare (som intervjuar för en anställd):
- Ställ frågor om den anställdas situation
- Fokusera på arbetsmiljöanpassningar
- Fråga om organisatoriska förändringar
- Hjälp att identifiera stödbehov för den anställda`;

        await query(`UPDATE admin_settings SET value = $1 WHERE key = $2`, [
          enhancedMessage,
          "interviewSystemMessage",
        ]);

        console.log(
          "✅ Interview system message enhanced with role-based instructions"
        );
      } else {
        console.log(
          "Interview system message already contains role-based instructions"
        );
      }
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("\nNext steps:");
    console.log(
      "1. Go to the admin panel to customize the role-specific welcome messages"
    );
    console.log("2. Test both bot types with different user roles");
    console.log("3. Monitor the console logs to see role detection in action");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Export for use as a standalone script
export { migrateToRoleBasedMessages };

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToRoleBasedMessages()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}
