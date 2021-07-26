import mongoose, { Schema, model } from 'mongoose';
import MongoSequence from 'mongoose-sequence';

const AutoIncreament = MongoSequence(mongoose);
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    sku: { type: String, required: true },
    image: {
      src: { type: String },
      disableZoom: { type: Boolean, default: false },
      autoRotate: { type: Boolean, default: true },
      autoRotateDelay: { type: Number, default: 3000 },
      backgroundColor: { type: String, default: '#ffffff' },
      cameraOrbit: {
        custom: { type: Schema.Types.Mixed },
        useDefault: { type: Boolean, default: false },
        default: { type: String, default: '0deg 75deg 105%' },
      },
      minCameraOrbit: {
        custom: { type: Schema.Types.Mixed },
        useDefault: { type: Boolean, default: false },
        default: { type: String, default: 'Infinity 22.5deg auto' },
      },
      maxCameraOrbit: {
        custom: { type: Schema.Types.Mixed },
        useDefault: { type: Boolean, default: false },
        default: { type: String, default: 'Infinity 157.5deg auto' },
      },
      cameraTarget: {
        custom: { type: Schema.Types.Mixed },
        useDefault: { type: Boolean, default: false },
        default: { type: String, default: 'auto auto auto' },
      },
      fieldOfView: { type: Number, default: 10 },
      exposure: { type: Number, default: 1 },
      shadowIntensity: { type: Number, default: 0 },
      shadowSoftness: { type: Number, default: 0 },
      alt: { type: String, default: 'Product name' },
      scale: {
        type: String,
        enum: ['auto', 'fixed'],
        default: 'auto',
      },
      placement: {
        type: String,
        enum: ['floor', 'wall'],
        default: 'floor',
      },
      metalness: { type: Number, default: 0 },
      roughness: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['QA', 'COMPLETED'],
      required: true,
    },
    itemNumber: { type: Number },
    bgColor: { type: String, required: true },
    customer: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
productSchema.plugin(AutoIncreament, { inc_field: 'itemNumber' });
productSchema.pre('save', function (next) {
  const product = this;
  product.image.alt = product.image.alt || product.name;
  return next();
});
const Product = model('Product', productSchema);

export default Product;
