import mongoose from 'mongoose';
import { config } from './env.js';

const connections = {};

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  // Ensure retryWrites=true is present; if not, add it
  let queryParams = query || '';
  if (!queryParams.includes('retryWrites=true')) {
    queryParams = queryParams ? `${queryParams}&retryWrites=true` : 'retryWrites=true';
  }
  return `${normalizedBase}${dbName}${queryParams ? `?${queryParams}` : ''}`;
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
    writeConcern: { w: 'majority' },
    readPreference: 'primary',
    retryWrites: true, // already in URI, but safe to set here too
  });
  
  // Wait for connection to be ready
  await new Promise((resolve, reject) => {
    conn.once('open', resolve);
    conn.once('error', reject);
  });
  
  connections[dbName] = conn;
  console.log(`Connected to database: ${dbName}`);
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
    writeConcern: { w: 'majority' },
    readPreference: 'primary',
    retryWrites: true,
  });
  
  await new Promise((resolve, reject) => {
    masterConnection.once('open', resolve);
    masterConnection.once('error', reject);
  });
  
  console.log('Master database ready');
  return masterConnection;
};

export default connectDB;
