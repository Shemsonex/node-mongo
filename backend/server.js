import express from "express";
import colors from 'colors';
import dotenv from "dotenv";
//import bodyParser from 'body-parser';
import {errorHandler} from './middleware/errorMiddleware.js'
const port = process.env.PORT || 5000;
import connectDB from './config/db.js'
import request from 'supertest'
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import options from "../docs/apidoc.js";
const app = express();
const corsOptions = {
    Origin: "http://127.0.0.1:8000",
  };    
  app.use(cors(corsOptions));

dotenv.config()
connectDB()

const specs = swaggerJsdoc(options);

app.use(
    "/apidocs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);


//app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler)
app.listen(port, () => console.log(`Server started on port ${port}`));

export default app