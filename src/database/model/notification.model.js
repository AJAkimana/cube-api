import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema(
  {
    description: { type: String, required: true },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    userRole: { type: String, required: true, default: 'Client' },
    reads: { type: [Schema.Types.ObjectId] },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const Notification = model('Notification', NotificationSchema);

export default Notification;
