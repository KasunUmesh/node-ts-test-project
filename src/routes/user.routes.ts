import express from "express";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';

import UserModel from "../models/user.model";
import * as SchemaTypes from "../types/SchemaTypes";
import * as UserController from "../controllers/user.controller"

import CustomResponse from "../dtos/custom.response";

const router = express.Router();


// ----------------User ----------------


// Get All Users

router.get('/all', UserController.getAllUsers)


// Create New User
router.post('/', UserController.createNewUser)



// Auth
router.post('/auth', UserController.authUser)

export default router;

