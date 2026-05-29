//D:\PROJECTS\EVIDENCE\Evidence_update_uniqueID_automaticID\evidence-protection-system-using-blockchain - Copy (2)\backend\database.js

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });

// ✅ MongoDB Connection URI
const uri = process.env.DB_URL;

// ✅ Create Mongo Client
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ✅ Connect DB (called only ONCE from server.js)
const connectDB = async () => {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
            console.log("✅ MongoDB connected");
        }
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

// ✅ Insert Case Evidence
const db_insert_case = async (caseNo, caseName, fileName, fileType) => {
    const database = client.db("evidenceytt03");
    const collection = database.collection("Case");

    const result = await collection.findOne({ Case_no: caseNo });

    if (result) {
        console.log("Document exists! Updating…");
        return await update_doc(collection, caseNo, caseName, fileName, fileType);
    } else {
        console.log("New Case Document Created");
        await insert_doc(collection, caseNo, caseName, fileName, fileType);
        return true;
    }
};

// ✅ Insert new case document
const insert_doc = async (collection, case_No, case_Name, file_Name, file_Type) => {
    await collection.insertOne({
        Case_no: case_No,
        Case_name: case_Name,
        Evidences: [
            {
                File_name: file_Name,
                File_type: file_Type,
            },
        ],
    });
};

// ✅ Update existing case document
const update_doc = async (collection, case_No, case_Name, file_Name, file_Type) => {
    const existing = await collection.findOne({ Case_no: case_No });

    if (existing.Case_name !== case_Name) return false;

    await collection.updateOne(
        { Case_no: case_No },
        {
            $push: {
                Evidences: {
                    File_name: file_Name,
                    File_type: file_Type,
                },
            },
        }
    );

    return true;
};

// ✅ Check if Police / Forensic ID exists
const check_id = async (_id_) => {
    const collection = client.db("evidenceytt03").collection("People");
    const result = await collection.findOne({ id: _id_ });
    return !!result;
};

// ✅ Retrieve evidence metadata
const find_evidences = async (caseNo) => {
    const collection = client.db("evidenceytt03").collection("Case");

    const result = await collection.findOne({ Case_no: caseNo });

    if (!result || !result.Evidences || result.Evidences.length === 0) {
        console.log("❌ No evidence found in DB");
        return null;
    }

    const fileNames = result.Evidences.map((e) => e.File_name);
    const fileTypes = result.Evidences.map((e) => e.File_type);

    return [fileNames, fileTypes];
};


// ✅ Add user (Police / Forensic)
const add_user = async ({ id, name, userType }, passwd) => {
    const collection = client.db("evidenceytt03").collection("People");

    await collection.insertOne({
        id,
        name,
        department: userType,
        password: passwd,
    });

    return "success";
};

// ✅ Delete user
const delete_user = async ({ id }) => {
    const result = await client
        .db("evidenceytt03")
        .collection("People")
        .deleteOne({ id });

    return result.deletedCount; // return number of deleted docs
};

// ✅ Add admin
const add_admin = async ({ id }, passwd) => {
    await client.db("evidenceytt03").collection("Admins").insertOne({
        id,
        password: passwd,
    });
    return "success";
};

// ✅ Delete admin
const delete_admin = async ({ id }) => {
    const result = await client
        .db("evidenceytt03")
        .collection("Admins")
        .deleteOne({ id });

    return result.deletedCount;
};

// ✅ Fetch case name
const fetch_caseName = async (caseNo) => {
    const result = await client.db("evidenceytt03").collection("Case").findOne({ Case_no: caseNo });
    return result?.Case_name || null;
};

// ✅ Check globally if ID exists (People + Admins)
const check_global_id = async (_id_) => {
    const db = client.db("evidenceytt03");

    const people = await db.collection("People").findOne({ id: _id_ });
    if (people) return true;

    const admin = await db.collection("Admins").findOne({ id: _id_ });
    if (admin) return true;

    return false;
};

module.exports = {
    connectDB,
    client,
    db_insert_case,
    check_id,
    check_global_id,
    find_evidences,
    add_user,
    delete_user,
    add_admin,
    delete_admin,
    fetch_caseName,
};
