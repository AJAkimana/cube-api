import faker from 'faker';
import id from 'mongoose';
import Service from '../../database/model/service.model';
import { subscribeUser } from './user.fixture';

const objectId = id.Types.ObjectId();

// eslint-disable-next-line import/prefer-default-export
const newService = {
  _id: objectId,
  userId: subscribeUser._id,
  name: 'Hosting',
  price: faker.finance.amount(),
  billingCycle: 'Yearly',
  descriptions: faker.lorem.paragraph(),
};

export const createService = async () => {
  await Service.create(newService);
};

export const dummySubscriptionId = newService._id;
