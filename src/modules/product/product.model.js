import mongoose, { Schema, model } from 'mongoose';
import MongoSequence from 'mongoose-sequence';
import defaultImages from '../../utils/constants';

const AutoIncreament = MongoSequence(mongoose);
const orbits = {
  side: { type: Number, default: 50 },
  ud: { type: Number, default: 50 },
  io: { type: Number, default: 50 },
};

const ImageSchema = new Schema({
  imageType: { type: String },
  imageFileName: { type: String },
  canBeDeleted: { type: Boolean, default: false },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number },
    sku: { type: String },
    image: {
      src: { type: String },
      disableZoom: { type: Boolean, default: false },
      autoRotate: { type: Boolean, default: true },
      autoRotateDelay: { type: Number, default: 3000 },
      backgroundColor: { type: String, default: '#ffffff' },
      cameraOrbit: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: '0deg 75deg 105%' },
      },
      minCameraOrbit: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: 'Infinity 22.5deg auto' },
      },
      maxCameraOrbit: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: 'Infinity 157.5deg auto' },
      },
      cameraTarget: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
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
      arButtonImage: { type: String },
      skyboxImage: {
        active: { type: Boolean, default: false },
        image: { type: String },
      },
      environmentImage: {
        active: { type: Boolean, default: false },
        image: { type: String },
      },
      imageFiles: { type: [ImageSchema], default: defaultImages },
      hotspots: [
        {
          dataPosition: { type: String },
          dataNormal: { type: String },
          dataText: { type: String },
          hotspotNum: { type: Number },
          bgColor: { type: String },
        },
      ],
    },
    status: { type: String, enum: ['', 'QA', 'COMPLETED'] },
    bgColor: { type: String, required: true },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    description: { type: String },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
productSchema.plugin(AutoIncreament, { inc_field: 'itemNumber' });
// eslint-disable-next-line func-names
productSchema.pre('save', function (next) {
  const product = this;
  product.image.alt = product.image.alt || product.name;
  return next();
});
const Product = model('Product', productSchema);

export default Product;
