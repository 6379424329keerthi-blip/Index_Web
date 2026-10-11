require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.connect()
    .then(() => {
        console.log("PostgreSQL connected successfully");
    })
    .catch((err) => {
        console.error("PostgreSQL connection failed:", err.message);
    });

app.post("/register", async (req, res) => {
    try {
        const {
            name,
            password,
            age,
            mobile,
            email,
            gender,
            state,
            skills
        } = req.body;

        const skillsText = Array.isArray(skills)
            ? skills.join(", ")
            : skills || "";

        const query = `
            INSERT INTO users
            (name, password, age, mobile, email, gender, state, skills)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *;
        `;

        const values = [
            name,
            password,
            age,
            mobile,
            email,
            gender,
            state,
            skillsText
        ];

        const result = await pool.query(query, values);

        res.json({
            message: "Registration successful",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration failed"
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});