import mongoose from 'mongoose';

const videoAdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  lastViewed: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

export const VideoAd = mongoose.models.VideoAd || mongoose.model('VideoAd', videoAdSchema);