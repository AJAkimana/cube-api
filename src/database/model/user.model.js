import mongoose from 'mongoose';

/**
 * Subscription schema
 */
const subscriptionSchema = new mongoose.Schema(
  {
    quoteId: {
      type: String,
      required: true,
      ref: 'Quote',
    },
    startDate: { type: String, required: true },
    expirationDate: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  },
);

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: true,
      default: 'visitor',
    },
    companyName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    subscription: [subscriptionSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', userSchema);
