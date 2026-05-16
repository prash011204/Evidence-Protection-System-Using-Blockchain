//D:\PROJECTS\EVIDENCE\Evidence_update_uniqueID_automaticID\evidence-vault - Copy (2)\backend\server.js

const { connectDB } = require("./database.js");
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const multer = require("multer");              
const bcrypt = require("bcrypt");

const { add_user, delete_user, add_admin, delete_admin, check_global_id } = require("./database.js");

// ✔ Multer parser for FormData WITHOUT files
const parseForm = multer().none();             
const deleteForm = multer().none();

connectDB(); // connect to DB

// ✅ Import DB functions + client (ONLY ONCE)
const {
  db_insert_case,
  check_id,
  find_evidences,
  client,
  fetch_caseName
} = require("./database.js");

// const {
//   blockchainInsert,
//   getEvidencesLink,
//   chainOfCustody,
// } = require("./blockchainConnect.js");

const {
  blockchainInsert,
  getEvidencesLink,
  chainOfCustody,
  insertLog
} = require("./blockchainConnect.js");

const { authUser, validateUser, authToken } = require("./auth.js");
const { web3StorageUpload, pinata } = require("./web3Storage.js");


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Multer storage setup (inside backend/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadFolder))
      fs.mkdirSync(uploadFolder, { recursive: true });
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const viewForm = multer().none();

// ✅ Login Route (FIXED)
app.post("/api/login", async (req, res) => {
  try {
    const { id, passwd, userType } = req.body;

    if (!id || !passwd || !userType) {
      return res.status(400).json({
        messageType: "error",
        messageContent: "All fields are required",
      });
    }

    const result = await validateUser({ id, passwd, userType });

    if (!result || result.status !== "success") {
        return res.status(401).json({
            messageType: "error",
            messageContent: "Invalid Credentials",
        });
    }

    const token = authToken(id);

    return res.json({
      messageType: "success",
      messageContent: "Login Successful",
      token,
      user: userType === "admin" ? "admin" : userType, // ✅ THIS FIXES YOUR ISSUE
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ messageType: "error", messageContent: "Server Error" });
  }
});

// ✅ Upload Route
// ✅ Upload Route (updated to KEEP local file)
app.post(
  "/api/upload",
  authUser,
  upload.single("evidence"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ messageType: "error", messageContent: "No file uploaded" });
      }

      const uploaderId = req.user?.userId;
      const { caseNo, caseName } = req.body;

      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileType = req.file.mimetype;

      if (!caseNo || !caseName) {
        return res.status(400).json({
          messageType: "error",
          messageContent: "Missing case details",
        });
      }

      const validID = await check_id(uploaderId);
      if (!validID) {
        return res
          .status(403)
          .json({ messageType: "error", messageContent: "Invalid ID" });
      }

      const dbResult = await db_insert_case(
        caseNo,
        caseName,
        fileName,
        fileType
      );
      if (!dbResult) {
        return res.status(400).json({
          messageType: "error",
          messageContent: "Case already exists",
        });
      }

      const cid = await web3StorageUpload(filePath);
      if (!cid) {
        return res
          .status(500)
          .json({ messageType: "error", messageContent: "IPFS Upload Failed" });
      }

      await blockchainInsert(
        uploaderId,
        caseNo,
        caseName,
        fileName,
        fileType,
        cid,
        "Upload"
      );

      return res.json({
        messageType: "success",
        messageContent: "File Uploaded Successfully!",
        cid,
      });
    } catch (err) {
      console.error("Upload Error:", err);
      return res
        .status(500)
        .json({ messageType: "error", messageContent: "Server Error" });
    }
  }
);

// ✅ View Route
app.post("/api/view", viewForm, async (req, res) => {
  try {
    const caseNo = req.body.caseNo;
    console.log("Searching Case_no =", req.body.caseNo);

    const evidences = await find_evidences(caseNo);
    if (!evidences) {
      return res.json({ message: "No evidences found" });
    }

    let fileNames, fileTypes;

    if (Array.isArray(evidences)) {
      fileNames = evidences[0];
      fileTypes = evidences[1];
    } else {
      fileNames = evidences.fileNames;
      fileTypes = evidences.fileTypes;
    }

    if (!Array.isArray(fileNames)) {
      fileNames = [fileNames];
    }

    if (!Array.isArray(fileTypes)) {
      fileTypes = [fileTypes];
    }

    console.log("✅ Evidence from DB:", fileNames, fileTypes);

    const fileLinks = await getEvidencesLink(caseNo, fileNames);

    if (!fileLinks) {
      return res.status(500).json({ message: "Blockchain query failed" });
    }

    const finalList = fileNames.map((fileName, idx) => ({
      key: idx + 1,
      id: fileLinks[fileName]?.id,
      fileName,
      fileType: fileTypes[idx],
      fileLink: fileLinks[fileName]?.file_hash_ipfs,
    }));

    return res.json(finalList);
  } catch (err) {
    console.error("❌ View Error:", err);
    return res.status(500).json(false);
  }
});

// ✅ Chain of custody logging
app.post("/api/coc", authUser, async (req, res) => {
  try {
    const { caseNo, fileName, fileType } = req.body;
    await chainOfCustody(req.user.userId, caseNo, fileName, fileType);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ✅ Delete Evidence Route
app.post("/api/deleteEvidence", authUser, deleteForm, async (req, res) => {
  try {
    const { caseNo, fileName } = req.body;

    if (!caseNo || !fileName) {
      return res.status(400).json({ message: "Missing caseNo or fileName" });
    }

    const userId = req.user.userId;

    // 1️⃣ Fetch evidence info from blockchain
    const evidences = await getEvidencesLink(caseNo, [fileName]);

    if (!evidences || !evidences[fileName]) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    const cid = evidences[fileName].file_hash_ipfs.split("/").pop();

    // 2️⃣ Fetch fileType + caseName from MongoDB BEFORE deletion
    const collection = client.db("evidenceytt03").collection("Case");
    const caseDoc = await collection.findOne({ Case_no: caseNo });

    if (!caseDoc) {
      return res.status(404).json({ message: "Case not found" });
    }

    const evidenceData = caseDoc.Evidences.find(e => e.File_name === fileName);

    if (!evidenceData) {
      return res.status(404).json({ message: "Evidence not found in DB" });
    }

    const fileType = evidenceData.File_type;
    const caseName = caseDoc.Case_name;

    // 3️⃣ 🔥 INSERT DELETE LOG INTO BLOCKCHAIN
    await insertLog(
      userId,
      caseNo,
      caseName,
      fileName,
      fileType,
      "Delete"
    );

    console.log("✅ Delete log written to blockchain");

    // 4️⃣ Delete local file
    const uploadsPath = path.join(__dirname, "uploads");
    const matchingFile = fs
      .readdirSync(uploadsPath)
      .find((f) => f.endsWith(fileName));

    if (matchingFile) {
      fs.unlinkSync(path.join(uploadsPath, matchingFile));
    }

    // 5️⃣ Unpin from Pinata
    try {
      await pinata.unpin(cid);
    } catch (err) {
      console.log("Pinata unpin error:", err.message);
    }

    // 6️⃣ Remove from MongoDB
    await collection.updateOne(
      { Case_no: caseNo },
      { $pull: { Evidences: { File_name: fileName } } }
    );

    const updatedDoc = await collection.findOne({ Case_no: caseNo });

    if (!updatedDoc || updatedDoc.Evidences.length === 0) {
      await collection.deleteOne({ Case_no: caseNo });
    }

    return res.json({ message: "Evidence deleted successfully" });

  } catch (err) {
    console.error("❌ Delete error:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
});

// =============================
// ✔ ADD USER (Admin Panel)
// =============================

app.post("/admin/add", parseForm, async (req, res) => {
  try {
    console.log("📩 ADD USER BODY =", req.body);

    const { id, name, userType, password } = req.body;

    if (!id || !name || !userType || !password) {
      return res.json({
        messageType: "error",
        messageContent: "All fields are required",
      });
    }

    // 🔥 ADD THIS CHECK
    const exists = await check_global_id(id);

    if (exists) {
      return res.json({
        messageType: "error",
        messageContent: "User ID already exists",
      });
    }

    // Hash password
    const hashed = bcrypt.hashSync(password, 10);

    if (userType === "admin") {
      await add_admin({ id }, hashed);
    } else {
      await add_user({ id, name, userType }, hashed);
    }

    return res.json({
      messageType: "success",
      messageContent: "User added successfully!",
    });

  } catch (err) {
    console.error("🔥 ADD USER ERROR:", err);
    return res.json({
      messageType: "error",
      messageContent: "Server error while adding user",
    });
  }
});


// =============================
// ✔ DELETE USER (Admin Panel)
// =============================
// =============================
// ✔ DELETE USER (ID BASED)
// =============================
app.post("/admin/delete", parseForm, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({
        messageType: "error",
        messageContent: "User ID required",
      });
    }

    const db = client.db("evidenceytt03");

    // 🔹 Try deleting from Admins
    const adminDelete = await db.collection("Admins").deleteOne({ id });

    if (adminDelete.deletedCount > 0) {
      return res.json({
        messageType: "success",
        messageContent: "Admin deleted successfully!",
      });
    }

    // 🔹 Try deleting from People (Police/Forensic)
    const userDelete = await db.collection("People").deleteOne({ id });

    if (userDelete.deletedCount > 0) {
      return res.json({
        messageType: "success",
        messageContent: "User deleted successfully!",
      });
    }

    // 🔴 Not found anywhere
    return res.json({
      messageType: "error",
      messageContent: "User does not exist",
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.json({
      messageType: "error",
      messageContent: "Server error while deleting user",
    });
  }
});



//ADMIN LOGS
app.post("/api/admin/logs", parseForm, async (req, res) => {
  try {
    const { caseNo } = req.body;

    if (!caseNo) {
      return res.json([]);
    }

    const logs = await chainOfCustody(caseNo);

    if (!logs || logs.length === 0) {
      return res.json([]);
    }

    // 🔥 Include timestamp (index 7)
    const formatted = logs.map((e) => ([
      e.id,
      e.case_no,
      e.case_name,
      e.file_name,
      e.file_type,
      e.file_hash_ipfs,
      e.status,
      e.timestamp    // ✅ ADD THIS
    ]));

    return res.json(formatted);

  } catch (err) {
    console.error("❌ Admin Logs Error:", err);
    return res.status(500).json([]);
  }
});


app.post("/admin/test", parseForm, (req, res) => {
  console.log("TEST BODY =", req.body);
  res.json(req.body);
});


// =============================
// ✔ FETCH CASE NAME (LIVE SEARCH)
// =============================
app.get("/api/caseName/:caseNo", async (req, res) => {
  try {
    const caseNo = req.params.caseNo;

    const caseName = await fetch_caseName(caseNo);

    return res.json({
      caseName: caseName || ""
    });

  } catch (err) {
    console.error("❌ CaseName Fetch Error:", err);
    return res.status(500).json({ caseName: "" });
  }
});

// =============================
// ✔ ADMIN OVERVIEW DASHBOARD
// =============================
app.get("/api/admin/overview", async (req, res) => {
  try {
    const db = client.db("evidenceytt03");

    // 🔹 Total Cases
    const totalCases = await db.collection("Case").countDocuments();

    // 🔹 Total Users (ONLY Police + Forensic)
    const totalUsers = await db.collection("People").countDocuments();

    // 🔹 Case Data
    const cases = await db.collection("Case").find().toArray();

    // 🔹 User Data (exclude admin automatically since only People)
    const users = await db.collection("People").find().toArray();

    return res.json({
      totalCases,
      totalUsers,
      cases,
      users
    });

  } catch (err) {
    console.error("❌ Overview API Error:", err);
    return res.status(500).json({
      totalCases: 0,
      totalUsers: 0,
      cases: [],
      users: []
    });
  }
});




// // ✅ Start Server
app.listen(5000, () => {
  console.log("\n✅ Backend running at http://localhost:5000");
});

// app.listen(5000, "0.0.0.0", () => {
//   console.log("\n✅ Backend running on network at port 5000");
// });
