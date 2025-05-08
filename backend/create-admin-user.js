// For creating users/update/view with node create-admin-user.js
// remove later

import bcrypt from "bcrypt";
import query from "./utils/supabaseQuery.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    const email = "test@chaschallenge.com";
    const password = "1234";
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Generated hash:", hash);

    // Check if user exists
    const existingUsers = await query(
      "SELECT * FROM admin_users WHERE email = $1",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("User already exists, updating password...");
      await query(
        "UPDATE admin_users SET password_hash = $1 WHERE email = $2",
        [hash, email]
      );
    } else {
      console.log("Creating new user...");
      await query(
        "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
        [email, hash]
      );
    }

    console.log("Admin user created/updated successfully!");

    // Verify user in database
    const users = await query("SELECT * FROM admin_users");
    console.log("All users:", users);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin();




// import bcrypt from "bcrypt";
// import query from "./utils/supabaseQuery.js";
// import dotenv from "dotenv";

// dotenv.config();

// async function updateUserPassword() {
//   try {
//     const email = "zarha@chaschallenge.com"; // The existing user
//     const newPassword = "1234"; // Choose a new password

//     // Hash the new password
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user
//     await query("UPDATE admin_users SET password_hash = $1 WHERE email = $2", [
//       passwordHash,
//       email,
//     ]);

//     console.log(`Password updated for ${email}`);
//     console.log(`New password is: ${newPassword}`);
//   } catch (error) {
//     console.error("Error updating password:", error);
//   }
// }

// updateUserPassword();







// import query from "./utils/supabaseQuery.js";
// import dotenv from "dotenv";

// dotenv.config();

// async function inspectUser() {
//   try {
//     const email = "zarha@chaschallenge.com";

//     const users = await query(
//       "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
//       [email]
//     );

//     if (users.length === 0) {
//       console.log(`User ${email} not found`);
//       return;
//     }

//     console.log("User details:");
//     console.log(`ID: ${users[0].id}`);
//     console.log(`Email: ${users[0].email}`);
//     console.log(`Password hash: ${users[0].password_hash}`);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// inspectUser();
