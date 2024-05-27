import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db"
import routerProjects from "./routes/projectRoutes";


dotenv.config();
connectDB()
const app = express()
app.use(express.json())
// Router
app.use('/api/projects',routerProjects)

export default app;