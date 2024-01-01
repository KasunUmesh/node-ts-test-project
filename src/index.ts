import express from 'express';
import bodyParser from "body-parser";

// invoke the express
const app = express();

// @ts-ignore
app.use(bodyParser.json());


/**
 * Get All Users
 */
app.get('/user/all', (req: express.Request, res: express.Response) => {

    let data = {
        _id: "U001",
        username: "Pathum",
        fname: "Pathum",
        lname: "silva",
        email: "pathum@example.com"
    }

    res.send(data);
})

/**
 * Create New User
 */
app.post('/user', (req: express.Request, res: express.Response) => {

    const req_body: any = req.body;
    console.log(req_body)

    res.send("OK");
})



// Start the server
app.listen(8081, () => {
    console.log("Server started on port 8080");
})