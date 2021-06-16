import { Schema, model } from 'mongoose';

/**
 * Subscription schema
 */
const subscriptionSchema = new Schema(
  {
    quote: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Quote',
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    billingCycle: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date },
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
const Subscription = model('Subscription', subscriptionSchema);
export default Subscription;
