import mongoose from 'mongoose';

/**
 * Invoice Schema
 */
const invoiceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    due_date: { type: Date, required: true },
    order: { type: String, ref: 'Order' },
    quote: { type: String, ref: 'Quote' },
    user: { type: String, required: true, ref: 'User' },
    status: { type: String, default: 'pending' },
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

export default mongoose.model('Invoice', invoiceSchema);
