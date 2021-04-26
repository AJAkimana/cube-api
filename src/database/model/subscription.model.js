import mongoose from 'mongoose';

/**
 * Subscription schema
 */
const subscriptionSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      ref: 'Quote',
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
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

export default mongoose.model('Subscription', subscriptionSchema);
