import express from 'express';
import UserRepository from '@/app/repositories/user.repository';
import db from '@/configs/db';
import AuthService from '@/app/services/auth.service';
import AuthController from '@/app/controllers/auth.controller';

const router = express.Router();

const repository = new UserRepository(db);
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post('/register', controller.registerNewUser);
router.post('/login', controller.loginUser);

export default router;
