// backend/web3Storage.js
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");

// ✅ Correct dotenv path (because .env is outside backend)
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

if (!PINATA_API_KEY && !PINATA_JWT) {
  console.error("❌ Missing Pinata credentials in .env!");
}

let pinata;

// ✅ Prefer JWT if available
if (PINATA_JWT) {
  pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });
} else {
  pinata = new pinataSDK({
    pinataApiKey: PINATA_API_KEY,
    pinataSecretApiKey: PINATA_SECRET_API_KEY,
  });
}

const web3StorageUpload = async (fullFilePath) => {
  try {
    if (!fs.existsSync(fullFilePath)) {
      throw new Error("File does not exist: " + fullFilePath);
    }

    const stream = fs.createReadStream(fullFilePath);

    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: path.basename(fullFilePath),
        keyvalues: { uploadedBy: "evidence-vault" },
      },
    });

    console.log("✅ Pinata upload success:", result.IpfsHash);
    return result.IpfsHash;

  } catch (err) {
    console.error("❌ Pinata upload error:", err);
    return null;
  }
};

module.exports = { web3StorageUpload, pinata };

