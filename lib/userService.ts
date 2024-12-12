import { User } from './models/User';
import { connectDB } from './db';
import bcrypt from 'bcryptjs';

export class UserService {
  async createUser(username: string, password: string, referredByUsername?: string) {
    await connectDB();
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check referral username if provided
    let referredBy = null;
    if (referredByUsername) {
      const referrer = await User.findOne({ username: referredByUsername });
      if (!referrer) {
        throw new Error('Invalid referral link');
      }
      referredBy = referrer.username;
    }

    const user = await User.create({
      username,
      password,
      balance: 0,
      hasPaidInitialFee: false,
      referredBy,
    });

    return {
      id: user._id.toString(),
      username: user.username,
      balance: user.balance,
      hasPaidInitialFee: user.hasPaidInitialFee,
    };
  }

  async findUser(username: string, password: string) {
    await connectDB();
    
    const user = await User.findOne({ username });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      balance: user.balance,
      hasPaidInitialFee: user.hasPaidInitialFee,
    };
  }

  async getUserById(id: string) {
    await connectDB();
    
    const user = await User.findById(id);
    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      balance: user.balance,
      hasPaidInitialFee: user.hasPaidInitialFee,
    };
  }

  async updatePaymentStatus(userId: string, status: boolean) {
    await connectDB();
    await User.findByIdAndUpdate(userId, { hasPaidInitialFee: status });
  }

  async processReferralReward(username: string) {
    await connectDB();
    const REFERRAL_REWARD = 1000;
    
    await User.findOneAndUpdate(
      { username },
      { $inc: { balance: REFERRAL_REWARD } }
    );
  }
}

export const userService = new UserService();

