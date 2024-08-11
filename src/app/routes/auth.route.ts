import express from 'express';
import UserRepository from '@/app/repositories/user.repository';
import db from '@/configs/db';
import AuthService from '@/app/services/auth.service';
import AuthController from '@/app/controllers/auth.controller';
import auth from '@/app/middlewares/auth.middleware';
import upload from '@/configs/multer';
import MailService from '../services/mail.service';

const router = express.Router();

const repository = new UserRepository(db);
const authService = new AuthService(repository);
const mailService = new MailService();
const controller = new AuthController(authService, mailService);

router.post('/register', controller.registerNewUser);
router.post('/login', controller.loginUser);
router.post('/token/refresh', auth, controller.refreshToken);
router.post('/password/change', auth, controller.changeUserPassword);
router.get('/profile', auth, controller.getProfile);
router.put(
  '/profile/edit',
  auth,
  upload.single('file'),
  controller.editProfile
);

export default router;
