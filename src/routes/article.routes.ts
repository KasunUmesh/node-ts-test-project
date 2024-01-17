import express from 'express';
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';
import {ObjectId} from "mongodb";

import ArticleModel from "../models/article.model";
import UserModel from "../models/user.model";

import CustomResponse from "../dtos/custom.response";

import * as Middleware from "../middlewares";

const router = express.Router();

// ---------------- Articles ----------------------

router.post('/', Middleware.verifyToken, async (req: express.Request, res: any) => {

    try {
        let req_body = req.body;

        let user_id = res.tokenData.user._id

        const articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(user_id)
        })

        await articleModel.save().then(r => {
            res.status(200).send(
                new CustomResponse(200, "Article Created successfully")
            )

        }).catch(e => {
            res.status(100).send(
                new CustomResponse(100, "Something went wrong")
            )
        });



    } catch (error) {
        res.status(100).send("Error");
    }
})

router.get('/', async (req: express.Request, res: express.Response) => {

    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let article = await ArticleModel.find().limit(size).skip(size * (page - 1));

        let documentCount = await ArticleModel.countDocuments();
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", article, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
})

router.get('/:username', async (req: express.Request, res: express.Response) => {
    try {

        let username: string = req.params.username;

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let user = await UserModel.findOne({username: username});

        if (!user) {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            )
        } else {
            let articles = await ArticleModel.find({user: user._id}).limit(size).skip(size * (page - 1));

            let documentCount = await ArticleModel.countDocuments({user: user._id});
            let pageCount = Math.ceil(documentCount/size);

            res.status(200).send(
                new CustomResponse(200, "Articles are found successfully", articles, pageCount)
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

router.get('/get/my', Middleware.verifyToken, async (req: express.Request, res: any) => {
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let user_id = res.tokenData.user._id

        let articles = await ArticleModel.find({user: user_id}).limit(size).skip(size * (page - 1));

        let documentCount = await ArticleModel.countDocuments({user: user_id});
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", articles, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
})

router.put('/', Middleware.verifyToken, async (req: express.Request, res: any) => {
    try {

        let req_body: any = req.body

        let user_id = res.tokenData.user._id;

        let article = await ArticleModel.find({_id: req_body.id, user: user_id})

        if (article) {

            await ArticleModel.findOneAndUpdate({_id: req_body.id}, {
                title: req_body.title,
                description: req_body.description
            }).then(r => {
                res.status(200).send(
                    new CustomResponse(200, "Article updated successfully")
                )
            }).catch(e => {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong")
                )
            })

        } else {
            res.status(401).send(
                new CustomResponse(401, "Access denied")
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

router.delete('/:id', Middleware.verifyToken, async (req: express.Request, res: any)=> {
    try {
        let user_id = res.tokenData.user._id;

        let article_id: string = req.params.id;

        let article = await ArticleModel.find({_id: article_id, user: user_id})

        if (article) {

            await ArticleModel.deleteOne({_id: article_id}).then(r => {
                res.status(200).send(
                    new CustomResponse(200, "Article deleted successfully")
                )
            }).catch(e => {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong")
                )
            })

        } else {
            res.status(401).send(
                new CustomResponse(401, "Access denied")
            )
        }

    } catch (error) {
        res.status(100).send("Error")
    }
})

export default router;