import History from '../database/model/history.model';

const logActions = [
  'project_create',
  'project_edit',
  'project_status',
  'project_manager',
  'quote_create',
  'quote_update',
  'quote_status',
  'invoice_approve',
  'subscription_create',
];

export const logProject = async (
  entities = {},
  action = 'project_create',
  details = null,
) => {
  try {
    const { project, user, manager } = entities;
    const descriptions = {
      project_create: `Project created`,
      project_edit: `Project edited`,
      project_status: `Project status changed`,
      project_manager: `A new manager(${manager.fullName}) assigned`,
      quote_create: `New quote created by ${user.fullName}`,
      quote_update: details || `Quote edited`,
      quote_status: details || `Quote status changed`,
      invoice_approve: `Invoice approved`,
      subscription_create: `New subscription created`,
    };
    const logAction =
      logActions.indexOf(action) < 0 ? 'project_create' : action;
    await History.create({
      description: descriptions[logAction],
      project: project._id,
      user: user?._id,
      manager: manager?._id,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
