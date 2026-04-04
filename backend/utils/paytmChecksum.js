const crypto = require("crypto");

const iv = "@@@@&&&&####$$$$";

// 🔥 GENERATE SIGNATURE
function generateSignature(params, key) {
  return new Promise((resolve, reject) => {
    try {
      const data = Object.keys(params)
        .sort()
        .map((k) => params[k])
        .join("|");

      const hash = crypto
        .createHash("sha256")
        .update(data + key)
        .digest("hex");

      const hashString = hash + "####SALT";

      const cipher = crypto.createCipheriv(
        "aes-128-cbc",
        key,
        iv
      );

      let encrypted = cipher.update(hashString, "binary", "base64");
      encrypted += cipher.final("base64");

      resolve(encrypted);
    } catch (err) {
      reject(err);
    }
  });
}


// 🔥 VERIFY SIGNATURE (ADD THIS)
function verifySignature(params, key, checksum) {
  return new Promise(async (resolve, reject) => {
    try {
      const newChecksum = await generateSignature(params, key);
      resolve(newChecksum === checksum);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateSignature,
  verifySignature,
};