import express from "express";
import path from 'path';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

dotenv.config();
connectDB();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

app.use(express.json()); 

// API маршрути
app.use("/api/tasks", taskRoutes);
app.use('/api/user', userRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.get('/planning', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/planning-page.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});