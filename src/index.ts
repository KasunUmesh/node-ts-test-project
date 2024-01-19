import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';
import cors from "cors";


import UserRoutes from "./routes/user.routes";
import ArticleRoutes from "./routes/article.routes";


// invoke the express
const app = express();

app.use(cors({
    origin: "*"
}))

// @ts-ignore
app.use(bodyParser.json());

interface User {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string
}


mongoose.connect(process.env.MONGO_URL as string)
const db = mongoose.connection

db.on('error', (error) => {
    console.log("DB Connection Error: ", error)
})

db.on('open', () => {
    console.log("DB Connection Successfully")
})


// ----------------User ----------------
app.use('/user', UserRoutes)

// ---------------- Articles ----------------------
app.use('/article', ArticleRoutes)


// Start the server
app.listen(8081, () => {
    console.log("Server started on port 8080");
})