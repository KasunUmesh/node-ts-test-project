import express from "express";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';

import UserModel from "../models/user.model";
import * as SchemaTypes from "../types/SchemaTypes";

import CustomResponse from "../dtos/custom.response";

const router = express.Router();


// ----------------User ----------------

/**
 * Get All Users
 */
router.get('/all', async (req: express.Request, res: express.Response) => {

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
router.post('/', async (req: express.Request, res: express.Response) => {

    try {
        const req_body: any = req.body;
        const userModel = new UserModel({
            username: req_body.username,
            fname: req_body.fname,
            lname: req_body.lname,
            email: req_body.email,
            password: req_body.password
        })

        let user: SchemaTypes.Iuser | null = await userModel.save();

        if (user) {
            user.password = "";
            res.status(200).send(
                new CustomResponse(200, "Users Created Successfully", user)
            )
        } else {
            res.status(100).send(
                new CustomResponse(100, "Something went wrong")
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }


})


/**
 * Auth
 */
router.post('/auth', async (req: express.Request, res: express.Response) => {

    try {
        const request_body = req.body;

        let user: SchemaTypes.Iuser | null = await UserModel.findOne({email: request_body.email});
        if (user) {
            if (user.password === request_body.password) {

                // Token generated
                user.password = "";

                const expiresIn = '1w';

                jwt.sign({user}, process.env.SECRET as Secret, {expiresIn}, (err: any, token: any) => {
                    if (err) {
                        res.status(100).send(
                            new CustomResponse(100, "Something went wrong")
                        )

                    } else {

                        let res_body = {
                            user: user,
                            accessToken: token
                        }

                        res.status(200).send(
                            new CustomResponse(200, "Access", res_body)
                        )
                    }
                })


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

export default router;

