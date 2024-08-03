import express from 'express';
import UserRepository from '@/app/repositories/user.repository';
import db from '@/configs/db';
import AuthService from '@/app/services/auth.service';
import AuthController from '@/app/controllers/auth.controller';
import auth from '@/app/middlewares/auth.middleware';

const router = express.Router();

const repository = new UserRepository(db);
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post('/register', controller.registerNewUser);
router.post('/login', controller.loginUser);
router.post('/refresh/token', auth, controller.refreshToken);
router.get('/profile', auth, controller.getProfile);
router.put('/profile/edit', auth, controller.editProfile);

export default router;
