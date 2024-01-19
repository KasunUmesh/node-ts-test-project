import express from 'express';
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';
import {ObjectId} from "mongodb";

import ArticleModel from "../models/article.model";
import UserModel from "../models/user.model";

import CustomResponse from "../dtos/custom.response";

import * as Middleware from "../middlewares";
import * as ArticleController from "../controllers/article.controller";

const router = express.Router();

// ---------------- Articles ----------------------

router.post('/', Middleware.verifyToken, ArticleController.createArticle)

router.get('/', ArticleController.getAllArticles)

router.get('/:username', ArticleController.getArticleByUsername)

router.get('/get/my', Middleware.verifyToken, ArticleController.getMyArticle)

router.put('/', Middleware.verifyToken, ArticleController.updateArticle)

router.delete('/:id', Middleware.verifyToken, ArticleController.deleteArticle)

export default router;