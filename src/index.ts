import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";

import UserModel from "./models/user.model";
import ArticleModel from "./models/article.model";

import CustomResponse from "./dtos/custom.response";

// invoke the express
const app = express();

// @ts-ignore
app.use(bodyParser.json());

interface User {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string
}

let users: User[] = [];

mongoose.connect("mongodb://localhost/blog")
const db = mongoose.connection

db.on('error', (error) => {
    console.log("DB Connection Error: ", error)
})

db.on('open', () => {
    console.log("DB Connection Successfully")
})


// ----------------User ----------------

/**
 * Get All Users
 */
app.get('/user/all', async (req: express.Request, res: express.Response) => {

    try {
        // This code Password not send Response
        // let users = await UserModel.find({}, '-password');

        let users = await UserModel.find();

        res.status(200).send(
            new CustomResponse(200, "Users are found Successfully", users)
        );
    } catch (error) {
        res.status(100).send("Error");
    }

})

/**
 * Create New User
 */
app.post('/user', async (req: express.Request, res: express.Response) => {

    try {
        const req_body: any = req.body;
        const userModel = new UserModel({
            username: req_body.username,
            fname: req_body.fname,
            lname: req_body.lname,
            email: req_body.email,
            password: req_body.password
        })

        let user = await userModel.save();
        user.password = "";
        res.status(200).send(
            new CustomResponse(200, "Users Created Successfully", user)
        );


    } catch (error) {
        res.status(100).send("Error");
    }


})


/**
 * Auth
 */
app.post('/user/auth', async (req: express.Request, res: express.Response) => {

    try {
        const request_body = req.body;

        let user = await UserModel.findOne({email: request_body.email});
        if (user) {
            if (user.password === request_body.password) {
                res.status(200).send(
                    new CustomResponse(200, "Access", user)
                );
            } else {
                res.status(401).send(
                    new CustomResponse(401, "Invalid Credentials")
                );
            }

        } else {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            );
        }


    } catch (error) {
        res.status(100).send("Error");
    }
})


// ---------------- Articles ----------------------

app.post('/article', async (req: express.Request, res: express.Response) => {

    try {
        let req_body = req.body;

        const articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(req_body.user)
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

app.get('/articles', async (req: express.Request, res: express.Response) => {

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

app.get('/articles/:username', async (req: express.Request, res: express.Response) => {
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

            let documentCount = await ArticleModel.countDocuments();
            let pageCount = Math.ceil(documentCount/size);

            res.status(200).send(
                new CustomResponse(200, "Articles are found successfully", articles, pageCount)
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

// Start the server
app.listen(8081, () => {
    console.log("Server started on port 8080");
})