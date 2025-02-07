import express from "express";
import { createTask, updateTask, deleteTask, getUserTasks, toggleTaskCompletion } from "../controllers/taskControllers.js";
import authenticateToken from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/", authenticateToken, createTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);
router.patch("/:id/completed", authenticateToken, toggleTaskCompletion);
router.get("/", authenticateToken, getUserTasks);

export default router;