import { Schema, model } from 'mongoose';

const projectSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    imageId: {
      type: String,
    },
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

const Project = model('Project', projectSchema);

export default Project;
