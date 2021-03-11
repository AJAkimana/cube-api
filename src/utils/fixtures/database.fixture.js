import User from '../../database/model/user.model';
import Service from '../../database/model/service.model';
import Invoice from '../../database/model/invoice.model';
import Project from '../../database/model/project.schema';

const cleanAllTables = async () => {
  await User.deleteMany({});
  await Service.deleteMany({});
  await Invoice.deleteMany({});
  await Project.deleteMany({});
};

export default cleanAllTables;
