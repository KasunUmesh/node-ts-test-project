import express from 'express';

// invoke the express
const app = express();

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

// Start the server
app.listen(8081, () => {
    console.log("Server started on port 8080");
})