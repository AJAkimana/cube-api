import faker from 'faker';

export const fakeProject = {
  name: faker.random.number(),
  status: 'paid',
};

export const newProject = {
  name: '3D Viewer',
  status: 'pending',
  descriptions: faker.lorem.paragraph(),
};
