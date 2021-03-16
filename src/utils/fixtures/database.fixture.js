import User from '../../database/model/user.model';
import Service from '../../database/model/service.model';
import Invoice from '../../database/model/invoice.model';
import Project from '../../database/model/project.schema';
import Quote from '../../database/model/quote.model';

const cleanAllTables = async () => {
  await User.deleteMany({});
  await Service.deleteMany({});
  await Invoice.deleteMany({});
  await Project.deleteMany({});
  await Quote.deleteMany({});
};

export default cleanAllTables;
