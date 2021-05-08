import { Router } from 'express';
import project from './project.controller';
import {
  validateProjectBody,
  updateProjectBody,
  updateProjectStatus,
} from './project.validation';
import {
  checkUserRole,
  checkUserRoleAndProjectExists,
  checkManagerRoleAndProjectExists,
} from './project.middleware';
import authorization from '../middleware/auth.middleware';
import { uploadImage } from '../../utils/image.util';

const { createProject, updateProject, getProjects } = project;
const projectRouter = Router();

projectRouter.post(
  '/',
  authorization,
  validateProjectBody,
  checkUserRole,
  uploadImage,
  createProject,
);

projectRouter.get('/', authorization, getProjects);
projectRouter.patch(
  '/:id',
  authorization,
  validateProjectBody,
  checkUserRoleAndProjectExists,
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
