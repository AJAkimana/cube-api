import History from '../database/model/history.model';

const logActions = [
  'project_create',
  'project_edit',
  'project_status',
  'project_manager',
  'quote_create',
  'quote_update',
  'quote_status',
  'invoice_create',
  'invoice_approve',
  'subscription_create',
];

export const logProject = async (
  entities = {},
  action = 'project_create',
  details = null,
  userRole = 'Client',
  invoiceId = null,
) => {
  try {
    const { project = {}, user = {}, manager = {} } = entities;
    const descriptions = {
      project_create: details || `Project created`,
      project_edit: details || `Project edited`,
      project_status: details || `Project status changed`,
      project_manager: details || `A new manager assigned`,
      quote_create: details || `New quote created`,
      quote_update: details || `Quote edited`,
      quote_status: details || `Quote status changed`,
      invoice_create: details || `Invoice created`,
      invoice_approve: details || `Invoice approved`,
      subscription_create: details || `New subscription created`,
    };
    const logAction =
      logActions.indexOf(action) < 0 ? 'project_create' : action;
    await History.create({
      description: descriptions[logAction],
      project: project._id,
      user: user?._id,
      manager: manager?._id,
      invoice: invoiceId,
      userRole,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};