import mongoose from 'mongoose';

/**
 * Quote Schema
 */
const quoteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    amount: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Quote', quoteSchema);
