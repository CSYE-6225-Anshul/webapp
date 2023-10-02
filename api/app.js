import express from "express"; 
import cors from "cors";
import db from "./models/index.js";
import routes from "./routes/index.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    next();
});

// passing app in routes
routes(app);

export default app;