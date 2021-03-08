import faker from 'faker';

export const updateInvoice = {
  amount: faker.random.number(),
  status: 'paid',
};

export const newInvoice = {
  orderId: faker.random.uuid(),
  due_date: new Date().toISOString().split('T')[0],
  amount: faker.random.number(),
  customerEmail: faker.internet.email(),
};
