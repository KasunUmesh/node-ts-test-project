import express from 'express';
import bodyParser from "body-parser";

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


/**
 * Get All Users
 */
app.get('/user/all', (req: express.Request, res: express.Response) => {

    // let data = {
    //     _id: "U001",
    //     username: "Pathum",
    //     fname: "Pathum",
    //     lname: "silva",
    //     email: "pathum@example.com"
    // }

    res.send(users);
})

/**
 * Create New User
 */
app.post('/user', (req: express.Request, res: express.Response) => {

    const req_body: any = req.body;
    console.log(req_body)

    users.push(req_body);

    res.send("OK");
})



// Start the server
app.listen(8081, () => {
    console.log("Server started on port 8080");
})