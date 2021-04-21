import mongoose from 'mongoose';

/**
 * Quote Schema
 */
const quoteSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, ref: 'User' },
    project: { type: String, required: true, ref: 'Project' },
    billingCycle: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String },
    comment: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Quote', quoteSchema);
