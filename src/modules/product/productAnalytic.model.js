import { Schema, model } from 'mongoose';

const productAnalyticSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    device: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    actionType: {
      type: String,
      enum: ['visit', 'click'],
      default: 'visit',
    },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
const ProductAnalytic = model(
  'ProductAnalytic',
  productAnalyticSchema,
);

export default ProductAnalytic;
