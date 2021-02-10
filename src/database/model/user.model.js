import mongoose from 'mongoose';

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      default: ' ',
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: ' ',
    },
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

export default mongoose.model('User', userSchema);
