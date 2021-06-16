import { Schema, model } from 'mongoose';

/**
 * Quote Schema
 */
const QuoteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    billingCycle: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String },
    comment: { type: String },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
const Quote = model('Quote', QuoteSchema);
export default Quote;
