import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema(
  {
    description: { type: String, required: true },
    content: { type: String, default: null },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    quote: {
      type: Schema.Types.ObjectId,
      ref: 'Quote',
      default: null,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    userRole: { type: String, required: true, default: 'Client' },
    reads: { type: [Schema.Types.ObjectId] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isCustom: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const Notification = model('Notification', NotificationSchema);

export default Notification;
