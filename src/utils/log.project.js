import Notification from '../database/model/notification.model';
import User from '../database/model/user.model';
import { sendUserEmail } from '../modules/mail/mail.controller';
import { emailTemplate } from './validationMail';

const logActions = [
  'project_create',
  'project_edit',
  'project_status',
  'project_manager',
  'quote_create',
  'quote_update',
  'quote_status',
  'quote_pending',
  'quote_declined',
  'invoice_create',
  'invoice_approve',
  'subscription_create',
  'asset_add',
];
const actionsToNotifyUser = [
  'project_create',
  'project_manager',
  'quote_pending',
  'quote_declined',
  'invoice_create',
  'invoice_approve',
];
export const sendEmailNotification = async (
  action = '',
  project = {},
  msgContent = {},
) => {
  try {
    const managerId = project?.manager?._id || project?.manager;
    const userId = project?.user?._id || project?.user;
    if (actionsToNotifyUser.indexOf(action) !== -1) {
      const notifiedUser = {
        project_create: 'admin',
        project_manager: managerId,
        quote_pending: userId,
        quote_declined: managerId,
        invoice_create: userId,
        invoice_approve: userId,
      };
      const receiverId = notifiedUser[action];
      let condition = { _id: receiverId };
      if (
        receiverId === 'admin' ||
        (!receiverId && action === 'quote_status')
      ) {
        condition = { role: 'Admin' };
      }
      const user = await User.findOne(condition);
      const subject = 'A.R.I project update';
      if (user) {
        let tempMail = `<b>${msgContent.title}</b><br/>`;
        tempMail += `${msgContent.info || ''}`;
        const content = emailTemplate(user, tempMail);
        await sendUserEmail(user, subject, content);
        // console.log('=>Action to be notified:====>', action);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
export const logProject = async (
  entities = {},
  content = {},
  action = 'project_create',
  userRole = 'Client',
) => {
  try {
    const {
      project = {},
      user = {},
      manager = {},
      createdBy = {},
    } = entities;
    const {
      details = null,
      invoiceId = null,
      info = null,
      quoteId = null,
    } = content;
    const descriptions = {
      project_create: `Project created`,
      project_edit: `Project edited`,
      project_status: `Project status changed`,
      project_manager: `A new manager assigned`,
      quote_create: `New proposal created`,
      quote_update: `Proposal edited`,
      quote_status: `Proposal status changed`,
      quote_pending: `New proposal created`,
      quote_accepted: `Proposal accepted`,
      quote_declined: `Proposal declined`,
      invoice_create: `Invoice created`,
      invoice_approve: `Invoice approved`,
      subscription_create: `New subscription created`,
      asset_add: `A 3D asset has added`,
    };
    const logAction =
      logActions.indexOf(action) < 0 ? 'project_create' : action;
    content.title = details || descriptions[logAction];
    await Notification.create({
      description: content.title,
      content: info,
      project: project._id,
      user: user?._id,
      manager: manager?._id,
      quote: quoteId,
      invoice: invoiceId,
      createdBy: createdBy._id,
      userRole,
    });

    await sendEmailNotification(logAction, project, content);
  } catch (error) {
    throw new Error(error.message);
  }
};
