import faker from 'faker';

export const fakeProject = {
  status: 'cancel',
  description: faker.lorem.paragraph(),
};

export const updateProject = {
  status: 'canceled',
  description: faker.lorem.paragraph(),
};

export const newProject = {
  name: '3D Viewer',
  status: 'pending',
  description: faker.lorem.paragraph(),
};

export const approveProject = {
  status: 'approved',
};
