const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = 4000;

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

let collection;

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve home.html
app.get("/", (req, res) => {

    res.sendFile(__dirname + "/public/home.html");

});
// Handle form submission
app.post("/server", async (req, res) => {

    try {

        const data = {

            name: req.body.name,

            password: req.body.password,

            age: Number(req.body.age),

            mobile: req.body.mobile,

            email: req.body.email,

            gender: req.body.gender,

            state: req.body.state,

            skills: req.body.skills || []

        };

        // Store data in MongoDB
        await collection.insertOne(data);


        // Display submitted details
        res.send(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>User Submitted Details</title>

                <style>

                    body {
                        font-family: Arial;
                        background-color: #f2f2f2;
                    }

                    .container {
                        width: 700px;
                        margin: 50px auto;
                        background: white;
                        padding: 30px;
                    }

                    h1 {
                        text-align: center;
                        color: blue;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        border: 1px solid black;
                        padding: 12px;
                        text-align: left;
                    }

                    th {
                        background-color: #eeeeee;
                    }

                    a {
                        display: block;
                        margin-top: 20px;
                        text-align: center;
                    }

                </style>

            </head>

            <body>

                <div class="container">

                    <h1>User Submitted Details</h1>

                    <table>

                        <tr>
                            <th>Name</th>
                            <td>${data.name}</td>
                        </tr>

                        <tr>
                            <th>Password</th>
                            <td>${data.password}</td>
                        </tr>

                        <tr>
                            <th>Age</th>
                            <td>${data.age}</td>
                        </tr>

                        <tr>
                            <th>Mobile Number</th>
                            <td>${data.mobile}</td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>${data.email}</td>
                        </tr>

                        <tr>
                            <th>Gender</th>
                            <td>${data.gender}</td>
                        </tr>

                        <tr>
                            <th>State</th>
                            <td>${data.state}</td>
                        </tr>

                        <tr>
                            <th>Skills</th>
                            <td>${data.skills.join(", ")}</td>
                        </tr>

                    </table>

                    <a href="/">
                        Register Another User
                    </a>

                </div>

            </body>

            </html>

        `);

    }

    catch (error) {

        console.log(error);

        res.status(500).send("Error storing data");

    }

});


// Connect MongoDB
async function startServer() {

    try {

        await client.connect();

        console.log("Connected to MongoDB");

        const db = client.db("collegeDB");

        collection = db.collection("users");

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    }

    catch (error) {

        console.log("MongoDB connection failed:");

        console.log(error);

    }

}


startServer();