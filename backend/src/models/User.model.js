/**
 * User Model
 * Defines the schema for user accounts
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local',
  },
  providerId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  pages: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  sharedPages: {
    type: [mongoose.Types.ObjectId],
    required: true,
    default: [],
  },
  banned: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);
