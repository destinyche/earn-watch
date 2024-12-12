import mongoose from 'mongoose';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      family: 4,
      // SSL/TLS options
      ssl: true,
      tls: true,
      tlsAllowInvalidHostnames: true,
      tlsAllowInvalidCertificates: true,
      directConnection: true
    };

    try {
      console.log('Attempting to connect to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI);
      cached.conn = await cached.promise;
      console.log('Successfully connected to MongoDB');
      return cached.conn;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export function getConnectionStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    stateMessage: getStateMessage(mongoose.connection.readyState),
    host: mongoose.connection.host,
    database: mongoose.connection.name,
  };
}

function getStateMessage(state: number): string {
  switch (state) {
    case 0: return 'Disconnected';
    case 1: return 'Connected';
    case 2: return 'Connecting';
    case 3: return 'Disconnecting';
    default: return 'Unknown';
  }
} 