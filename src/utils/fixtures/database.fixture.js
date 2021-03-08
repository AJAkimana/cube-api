import User from '../../database/model/user.model';
import Service from '../../database/model/service.model';
import Invoice from '../../database/model/invoice.model';

const cleanAllTables = async () => {
  await User.deleteMany({});
  await Service.deleteMany({});
  await Invoice.deleteMany({});
};

export default cleanAllTables;
