import express from 'express'
import mongoose from "mongoose";
import "dotenv/config";
console.log(process.env.DB_CONNECTION_STRING);
import session from "express-session";
import cors from "cors";



import Hello from "./Hello.js"
import Lab5 from "./Lab5.js";

import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentsRoutes from "./Kanbas/Assignments/routes.js";
import UserRoutes from "./Users/routes.js";

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING);

const app = express()

app.use(
    cors({
             credentials: true,
             origin: [process.env.FRONTEND_URL, "http://localhost:3000"]

         })
);


app.use(express.json());

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        //domain: process.env.HTTP_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));


console.log("Setting up routes...");
UserRoutes(app);
console.log("Routes set up.");

ModuleRoutes(app);
CourseRoutes(app);
AssignmentsRoutes(app);
Lab5(app);
Hello(app)
app.listen(process.env.PORT || 4000);