import { Schema, model } from 'mongoose';

const projectSchema = new Schema(
  {
    user: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    nOfItems: { type: Number, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    description: { type: String, required: true },
    image: { type: String },
    imageId: { type: String },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const Project = model('Project', projectSchema);

export default Project;
