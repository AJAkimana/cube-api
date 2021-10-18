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
    status: { type: String, default: 'Pending' },
    comment: { type: String },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    isFixed: { type: Boolean, default: false },
    amounts: {
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
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
    expiryDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
const Quote = model('Quote', QuoteSchema);
export default Quote;
