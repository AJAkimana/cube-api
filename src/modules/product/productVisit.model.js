import { Schema, model } from 'mongoose';

const productVisitSchema = new Schema(
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
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
const ProductVisit = model('ProductVisit', productVisitSchema);

export default ProductVisit;
