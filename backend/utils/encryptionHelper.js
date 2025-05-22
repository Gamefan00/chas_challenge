import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// IMPORTANT: Key is already a Buffer - don't wrap it in Buffer.from() again in the methods!
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
const IV_LENGTH = 16;

export function encrypt(data) {
  try {
    // Convert data to JSON string
    const jsonData = JSON.stringify(data);

    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Use ENCRYPTION_KEY directly - it's already a buffer
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    // Encrypt the data
    let encrypted = cipher.update(jsonData, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Combine IV and encrypted data and return as base64 string
    return Buffer.from(iv.toString("hex") + ":" + encrypted).toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

export function decrypt(encryptedData) {
  try {
    // Handle non-string data
    if (typeof encryptedData === "object") {
      return encryptedData;
    }

    // Handle plain JSON strings
    if (
      typeof encryptedData === "string" &&
      (encryptedData.trim().startsWith("[") ||
        encryptedData.trim().startsWith("{"))
    ) {
      try {
        return JSON.parse(encryptedData);
      } catch (e) {
        // Continue with normal decryption if parsing fails
      }
    }

    // Convert from base64 to string
    const buffer = Buffer.from(encryptedData, "base64").toString();

    // Split into IV and encrypted data
    const parts = buffer.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    // Use ENCRYPTION_KEY directly - it's already a buffer
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // Parse the decrypted JSON string
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}
