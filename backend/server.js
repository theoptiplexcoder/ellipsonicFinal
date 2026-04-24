require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const databaseConnection = require("./utils/db");
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(cors({
    origin:["http://localhost:3000", "http://localhost:3001","https://ellipsonicfinal.onrender.com"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(express.json());
app.use(errorMiddleware);

app.use("/api/v1/events",require("./router/eventRouter"))
app.use("/api/v1/auth-user",require("./router/authRouter"));
app.use("/api/v1/rsvp",require("./router/rsvpRouter"));

app.listen(3000,()=>{
    databaseConnection();
    console.log("Port running at 3000");
})