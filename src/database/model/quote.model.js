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
    status: { type: String, default: 'Draft' },
    comment: { type: String },
    taxes: [
      {
        title: { type: String, default: '' },
        amount: { type: Number, default: 0 },
      },
    ],
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
    idNumber: { type: Number, default: 4 },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
QuoteSchema.pre('save', function (next) {
  if (this.isNew) {
    this.constructor.find({}).then((records) => {
      this.idNumber = records.length + 1;
      next();
    });
  }
});
const Quote = model('Quote', QuoteSchema);
export default Quote;
