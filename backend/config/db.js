const mongoose = require("mongoose");

const connections = {};

/**
 * Build a MongoDB URI with the database name inserted before query parameters.
 * Example: "mongodb+srv://.../?retryWrites=true" + "myDb" -> "mongodb+srv://.../myDb?retryWrites=true"
 */
const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const connectDB = async (dbName) => {
  if (connections[dbName]) {
    console.log(`♻️ Reusing connection for ${dbName}`);
    return connections[dbName];
  }

  const baseURI = process.env.MONGODB_URI;
  if (!baseURI) {
    throw new Error("❌ MONGODB_URI not defined in .env");
  }

  const uri = buildDatabaseURI(baseURI, dbName);
  // Log URI without password for debugging
  const safeUri = uri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@');
  console.log(`🔌 Connecting to ${dbName} with URI: ${safeUri}`);

  const conn = await mongoose.createConnection(uri);
  console.log(`✅ Connected to DB: ${dbName}`);

  connections[dbName] = conn;
  return conn;
};

module.exports = connectDB;
/*const mongoose = require("mongoose");

const connections = {};

const connectDB = async (dbName) => {
    if (connections[dbName]) {
        return connections[dbName];
    }

    const baseURI = process.env.MONGODB_URI;

    if (!baseURI) {
        throw new Error("❌ MONGODB_URI not defined in .env");
    }

    const uri = `${baseURI}/${dbName}`;

    const conn = await mongoose.createConnection(uri);

    console.log(`✅ Connected to DB: ${dbName}`);

    connections[dbName] = conn;
    return conn;
};

module.exports = connectDB;*/



/*const mongoose = require("mongoose");

const connections = {};

const connectDB = async (dbName) => {
    if (connections[dbName]) {
        return connections[dbName];
    }

    const baseURI = process.env.MONGODB_URI;

    if (!baseURI) {
        throw new Error("❌ MONGODB_URI not defined in .env");
    }

    const uri = `${baseURI}/${dbName}`;

    const conn = await mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`✅ Connected to DB: ${dbName}`);

    connections[dbName] = conn;
    return conn;
};

module.exports = connectDB;*/