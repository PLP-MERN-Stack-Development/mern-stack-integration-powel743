// /server/routes/userRoutes.js
import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', authUser); // POST /api/users/login
router.route('/').post(registerUser); // POST /api/users

export default router;