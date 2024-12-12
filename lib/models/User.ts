import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from "@/lib/db"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  watchBalance: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  hasPaidInitialFee: {
    type: Boolean,
    default: false,
  },
  referredBy: {
    type: String,
    default: null,
  },
  dailyAdWatches: {
    count: {
      type: Number,
      default: 0,
    },
    lastReset: {
      type: Date,
      default: Date.now,
    }
  }
}, { timestamps: true });

// Only hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.watchBalance === undefined) {
    this.watchBalance = 0;
  }
  next();
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Helper function to check daily watch limit
export function canWatchMoreAds(user: any) {
  const DAILY_LIMIT = 4;
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Reset count if it's a new day
  if (Date.now() - new Date(user.dailyAdWatches.lastReset).getTime() > ONE_DAY) {
    return true; // If it's a new day, they can watch
  }
  
  return user.dailyAdWatches.count < DAILY_LIMIT;
} 

// Add a migration script to add watchBalance to existing users
async function addWatchBalanceToExistingUsers() {
  try {
    await connectDB();
    await User.updateMany(
      { watchBalance: { $exists: false } },
      { $set: { watchBalance: 0 } }
    );
    console.log('Added watchBalance field to existing users');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Call this when the app starts
addWatchBalanceToExistingUsers();