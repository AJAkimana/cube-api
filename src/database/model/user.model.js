import mongoose from 'mongoose';

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    companyName: { type: String, required: true },
    companyUrl: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    password: { type: String, default: '' },
    resetKey: { type: String },
    role: { type: String, required: true, default: 'Client' },
    website: { type: String },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);
userSchema.pre('save', function (next) {
  const user = this;
  // Save fullName if it has been modified (or is new)
  user.fullName = `${user.firstName} ${user.lastName}`;
  return next();
});
const User = mongoose.model('User', userSchema);

export default User;
