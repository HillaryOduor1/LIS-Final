import mongoose from 'mongoose';
import { config } from './env.js';

const connections = {};

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const connectDB = async (dbName) => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const uri = buildDatabaseURI(config.mongodbUri, dbName);
  const conn = await mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 30000,
  });
  
  // Wait for connection to be ready
  await new Promise((resolve, reject) => {
    conn.once('open', resolve);
    conn.once('error', reject);
  });
  
  connections[dbName] = conn;
  console.log(`✅ Connected to database: ${dbName}`);
  return conn;
};

// Master database connection
let masterConnection = null;
export const getMasterConnection = async () => {
  if (masterConnection) return masterConnection;
  const masterDbName = 'master';
  const uri = buildDatabaseURI(config.mongodbUri, masterDbName);
  masterConnection = await mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  
  await new Promise((resolve, reject) => {
    masterConnection.once('open', resolve);
    masterConnection.once('error', reject);
  });
  
  console.log('✅ Master database ready');
  return masterConnection;
};

export default connectDB;
/*import mongoose from 'mongoose';
import { config } from './env.js';

const connections = {};

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const connectDB = async (dbName) => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const uri = buildDatabaseURI(config.mongodbUri, dbName);
  const conn = await mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  });
  connections[dbName] = conn;
  return conn;
};

// Master database connection
let masterConnection = null;
export const getMasterConnection = async () => {
  if (masterConnection) return masterConnection;
  const masterDbName = 'master';
  const uri = buildDatabaseURI(config.mongodbUri, masterDbName);
  masterConnection = await mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  return masterConnection;
};

export default connectDB;*/
/*last stable
const mongoose = require("mongoose");

const connections = {};

/**
 * Build a MongoDB URI with the database name inserted before query parameters.
 * Example: "mongodb+srv://.../?retryWrites=true" + "myDb" -> "mongodb+srv://.../myDb?retryWrites=true"
 /
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