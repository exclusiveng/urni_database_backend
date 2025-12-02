import { Router } from 'express';
import multer from 'multer';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema } from '../schemas/user.schema';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', validate(createUserSchema), userController.createUser);
router.post('/upload', upload.single('file'), userController.bulkUploadUsers);
router.get('/', userController.getUsers);

export default router;
