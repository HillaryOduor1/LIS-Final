const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    console.log('📍 Tenant middleware start');
    let tenant = null;
    
    // 1. Check query parameter 'tenant' (by dbName)
    const tenantParam = req.query.tenant;
    if (tenantParam) {
      tenant = await Tenant.findOne({ dbName: tenantParam });
      if (tenant) console.log(`✅ Tenant found via query param: ${tenant.dbName}`);
    }
    
    // 2. Fallback to Host header
    if (!tenant) {
      const host = req.headers.host.split(":")[0];
      console.log('Host:', host);
      tenant = await Tenant.findOne({ domain: host });
      if (tenant) console.log(`✅ Tenant found via host: ${tenant.dbName}`);
    }
    
    // 3. If still no tenant, try to find by the known correct dbName (hardcoded for now, but you can make it configurable)
    if (!tenant) {
      // This ensures we find the tenant that actually has data
      tenant = await Tenant.findOne({ dbName: "landscapes_integrity_solutions" });
      if (tenant) console.log(`✅ Tenant found via fallback: ${tenant.dbName}`);
    }

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantConn = await connectDB(tenant.dbName);
    console.log('Tenant DB connection established');

    req.tenant = tenant;
    req.models = {
      User: tenantConn.models.User || tenantConn.model('User', require('../models/User')),
      Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../models/Settings')),
      Content: tenantConn.models.Content || tenantConn.model('Content', require('../models/Content')),
      Media: tenantConn.models.Media || tenantConn.model('Media', require('../models/Media')),
      ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../models/ActivityLog')),
      ContactMessage: tenantConn.models.ContactMessage || tenantConn.model('ContactMessage', require('../models/ContactMessage')),
    };
    console.log('Models attached to req');
    console.log('Models attached to req:', Object.keys(req.models));

    next();
  } catch (err) {
    console.error('❌ Tenant middleware error:', err);
    res.status(500).json({ message: err.message });
  }
};
/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    console.log('📍 Tenant middleware start');
    const host = req.headers.host.split(":")[0];
    console.log('Host:', host);
    
    const tenant = await Tenant.findOne({ domain: host });
    console.log('Tenant found:', tenant ? tenant.dbName : 'none');

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantConn = await connectDB(tenant.dbName);
    console.log('Tenant DB connection established');

    req.tenant = tenant;
    req.models = {
      User: tenantConn.models.User || tenantConn.model('User', require('../models/User')),
      Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../models/Settings')),
      Content: tenantConn.models.Content || tenantConn.model('Content', require('../models/Content')),
      Media: tenantConn.models.Media || tenantConn.model('Media', require('../models/Media')),
      ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../models/ActivityLog')),
    };
    console.log('Models attached to req');

    next();
  } catch (err) {
    console.error('❌ Tenant middleware error:', err);
    res.status(500).json({ message: err.message });
  }
};*/
/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        console.log('📍 Tenant middleware start');
        const host = req.headers.host.split(":")[0];
        console.log('Host:', host);
        
        const tenant = await Tenant.findOne({ domain: host });
        console.log('Tenant found:', tenant ? tenant.dbName : 'none');

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const tenantConn = await connectDB(tenant.dbName);
        console.log('Tenant DB connection established');

        req.tenant = tenant;
        /*req.models = {
            User: tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };/
        req.models = {
            User: tenantConn.models.User || tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.models.Content || tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.models.Media || tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };
        console.log('Models attached to req');

        next();
    } catch (err) {
        console.error('❌ Tenant middleware error:', err);
        res.status(500).json({ message: err.message });
    }
};*/


/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        const host = req.headers.host.split(":")[0];
        const tenant = await Tenant.findOne({ domain: host });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        // Connect to tenant DB
        const tenantConn = await connectDB(tenant.dbName);

        // Attach models to request
        req.tenant = tenant;
        req.models = {
            User: tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};*/
/*const Tenant = require("../models/Tenant");

module.exports = async (req, res, next) => {
    try {
        const host = req.headers.host.split(":")[0];

        const tenant = await Tenant.findOne({ domain: host });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};*/