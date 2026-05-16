//evidence-vault/backend/auth.js

require('dotenv').config({ path: '../.env' });

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

// ✅ DB connection
const client = new MongoClient(process.env.DB_URL);

const hashPasswd = (passwd) => {
    return bcrypt.hashSync(passwd, 10);
};

const authToken = (userId) => {
    return jwt.sign({ userId }, process.env.TOKEN_SECRET)

};

// ✅ Middleware to check token
const authUser = (req, res, next) => {

    console.log("\n========== AUTH DEBUG ==========");

    const authHeader = req.headers["authorization"];
    console.log("🔥 AUTH HEADER:", authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    console.log("🔥 TOKEN:", token);

    if (!token) {
        console.log("❌ No token provided");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedUser) => {

        if (err) {
            console.log("❌ JWT ERROR:", err.message);
            console.log("❌ TOKEN SECRET:", process.env.TOKEN_SECRET);
            return res.sendStatus(403);
        }

        console.log("✅ DECODED USER:", decodedUser);

        req.user = decodedUser;

        console.log("========== AUTH SUCCESS ==========\n");

        next();
    });
};

// ✅ Login validate function
const validateUser = async ({ id, passwd, userType }) => {
    try {
        await client.connect();

        if (userType === "admin") {
            const admin = await client
                .db("evidenceytt03")
                .collection("Admins")
                .findOne({ id });

            if (!admin) return { status: "invalid" };

            const match = await bcrypt.compare(passwd, admin.password);

            return match ? { status: "success", role: "admin" } : { status: "invalid" };
        }

        // Police / Forensic
        const user = await client
            .db("evidenceytt03")
            .collection("People")
            .findOne({ id });

        if (!user) return { status: "invalid" };

        // 🔥 Important: Check department matches selected userType
        if (user.department !== userType) {
            return { status: "invalid" };
        }

        const match = await bcrypt.compare(passwd, user.password);

        return match
            ? { status: "success", role: user.department }
            : { status: "invalid" };

    } catch (error) {
        console.error("🔥 validateUser ERROR →", error);
        return { status: "error" };
    }
};


module.exports = { authToken, hashPasswd, validateUser, authUser };
