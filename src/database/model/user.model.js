import mongoose from 'mongoose';

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    password: { type: String, default: '' },
    resetKey: { type: String },
    role: { type: String, required: true, default: 'visitor' },
    companyName: { type: String, required: true },
    website: { type: String },
    address: { type: String, required: true },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', userSchema);
