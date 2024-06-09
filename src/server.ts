import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import morgan from "morgan";
import {connectDB} from "./config/db"
import routerProjects from "./routes/projectRoutes";
import routerAuth from "./routes/authRoutes";
import { corsConfig } from "./config/cors";


dotenv.config();
connectDB()
const app = express()
app.use(cors(corsConfig))
app.use(express.json())
app.use(morgan('dev'))
// Router
app.use('/api/auth',routerAuth)
app.use('/api/projects',routerProjects)

export default app;