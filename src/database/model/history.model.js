import { Schema, model } from 'mongoose';

const HistorySchema = new Schema(
  {
    description: { type: String, required: true },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    userRole: { type: String, required: true, default: 'Client' },
    reads: { type: [Schema.Types.ObjectId] },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const History = model('History', HistorySchema);

export default History;
