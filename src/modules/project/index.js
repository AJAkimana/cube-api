import { Router } from 'express';
import project from './project.controller';
import {
  validateProjectBody,
  updateProjectBody,
  updateProjectStatus,
} from './project.validation';
import {
  checkManagerRoleAndProjectExists,
  doesProjectExist,
} from './project.middleware';
import authorization, {
  isClient,
  isNotVisitor,
} from '../middleware/auth.middleware';
import { uploadImage } from '../../utils/image.util';

const { createProject, updateProject, getProjects } = project;
const projectRouter = Router();

projectRouter.post(
  '/',
  authorization,
  isClient,
  validateProjectBody,
  uploadImage,
  createProject,
);

projectRouter.get('/', authorization, getProjects);
projectRouter.patch(
  '/:id',
  authorization,
  isNotVisitor,
  validateProjectBody,
  doesProjectExist,
  updateProject,
);

projectRouter.patch(
  '/approve-project/:id',
  authorization,
  updateProjectStatus,
  checkManagerRoleAndProjectExists,
  updateProject,
);

export default projectRouter;
