import faker from 'faker';
import id from 'mongoose';
import Quote from '../../database/model/quote.model';
import { projectId } from './project.fixture';
import { userId } from './user.fixture';

const objectId = id.Types.ObjectId();

export const newQuote = {
  projectId,
  billingCycle: 'Monthly',
  amount: 5000,
};

const quote = {
  _id: objectId,
  userId,
  projectId,
  billingCycle: 'Monthly',
  amount: faker.random.number(),
};

export const createQuote = async () => {
  await Quote.create(quote);
};

export const dummyQuoteId = quote._id;
