const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    name: String,
    domain: String, // e.g. site1.com
    dbName: String, // e.g. tenant_xxx
    siteId: String, // UUID
});

module.exports = mongoose.model("Tenant", tenantSchema);