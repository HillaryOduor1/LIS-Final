const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");
const userSchema = require("../models/User");

const router = express.Router();

router.post("/create-site", async (req, res) => {
    const { name, domain, adminUsername, adminPassword } = req.body;

    const siteId = uuidv4();
    const dbName = `tenant_${siteId}`;

    const tenant = await Tenant.create({
        name,
        domain,
        dbName,
        siteId,
    });

    // Create tenant DB + admin user
    const conn = await connectDB(dbName);
    const User = conn.model("User", userSchema);

    const hashed = await bcrypt.hash(adminPassword, 10);

    await User.create({
        username: adminUsername,
        password: adminPassword,
    });

    res.json({ message: "Tenant created", tenant });
});

module.exports = router;