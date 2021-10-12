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
    status: { type: String },
    amount: { type: Number },
    tax: { type: Number, default: 0 },
    comment: { type: String },
    propasalText: { type: String },
    customerNote: { type: String },
    items: [
      {
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        total: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
const Quote = model('Quote', QuoteSchema);
export default Quote;
