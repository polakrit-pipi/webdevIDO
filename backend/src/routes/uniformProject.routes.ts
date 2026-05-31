import { Router } from 'express';
import { listUniformProjects, getUniformProject } from '../controllers/uniformProject.controller';

const router = Router();

router.get('/', listUniformProjects);
router.get('/:id', getUniformProject);

export default router;
