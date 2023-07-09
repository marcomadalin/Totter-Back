require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const twittRoutes = require("./routes/twittRoutes");
const userRoutes = require("./routes/userRoutes");
const multer = require('multer');
const connectDB = require("./config/dbCon");
const corsOptions = require("./config/corsOptions");

const app = express();

connectDB()

app.use(cors(corsOptions))
app.use(express.json());
app.use(cors());
app.use(multer().any())

app.use((req, res, next) => {
  console.log(req.path, req.method);
  console.log(req.body);
  next();
});


app.use("/twitts", twittRoutes);
app.use("/users", userRoutes);


mongoose.connection.once('open', () => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to DB, listening on port: " + process.env.PORT);
    });
})
