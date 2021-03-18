import faker from 'faker';
import id from 'mongoose';
import Project from '../../database/model/project.schema';

const objectId = id.Types.ObjectId();

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

const project = {
  _id: objectId,
  userId: '5fff2a57ab5f62aef78fe0b7',
  name: '3D Viewer',
  description: faker.lorem.paragraph(),
};

export const projectId = project._id;

export const createProject = async () => {
  await Project.create(project);
};

export const dummySubscriptionId = project._id;
