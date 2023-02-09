const express = require("express");
const dotenv = require("dotenv").config();
const colors = require('colors')
//const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

connectDB()
const app = express();

//app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app