import express from "express";
import { DeleteUser, GetUser, GetUserByUsername, GetUsers, Login, requestPasswordReset, resetPassword, Signup, updatePassword, UpdateUser, verifyEmailHash, verifyLoginCode } from "../controllers/userController.js";
import { userSchema, validateRequest } from "../middleware/validateRequest.js";
import verifyToken from "../middleware/verifyToken.js";
import {validate }from '../controllers/authController.js'

const authRoute = express.Router()

authRoute.post('/api/v1/users', validateRequest(userSchema), Signup)
authRoute.post('/api/v1/users/auth', Login)
authRoute.post('/api/v1/users/auth/verify-code', verifyLoginCode)
authRoute.get('/api/v1/users/verify-email', verifyEmailHash)
authRoute.get('/api/v1/users/:id', verifyToken, GetUser)
authRoute.get('/api/v1/users/', verifyToken, GetUsers)
authRoute.get('/api/v1/users/auth/verify-token', validate)
authRoute.get('/api/v1/users/username/:username', verifyToken, GetUserByUsername)
authRoute.put('/api/v1/users/:id', verifyToken, UpdateUser)
//password
authRoute.post('/api/v1/users/auth/request-password-reset', requestPasswordReset);
authRoute.post('/api/v1/users/auth/reset-password', resetPassword);
authRoute.put('/api/v1/users/:id/password', verifyToken, updatePassword);

authRoute.delete('/api/v1/users/:id', verifyToken , DeleteUser)


export default authRoute
