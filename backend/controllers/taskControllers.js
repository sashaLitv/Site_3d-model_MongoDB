import Task from '../models/Task.js';

// Створення завдання
export const createTask = async (req, res) => {
    try {
        const { task_name, due_date, importance, description, user_id } = req.body;
        if (!user_id) {
            console.log("User ID is missing in the request");
            return res.status(400).json({ message: "User ID is required" });
        }

        const newTask = new Task({
            task_name,
            due_date,
            importance,
            description,
            user_id,
        });

        await newTask.save();
        res.status(201).json({ message: "Task created", task: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Редагування завдання
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params);
        const { task_name, due_date, importance, description } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            console.log(`Task not found with id: ${id}`);
            return res.status(404).json({ message: "Task not found" });
        }

        task.task_name = task_name || task.task_name;
        task.due_date = due_date || task.due_date;
        task.importance = importance || task.importance;
        task.description = description || task.description;

        await task.save();
        res.status(200).json({ message: "Task updated", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Видалення завдання
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.deleteOne({ _id: id });

        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        console.error("Error deleting tasks:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Вивід завдань
export const getUserTasks = async (req, res) => {
    try {
        const userId = req.user.userId;

        const tasks = await Task.find({ user_id: userId });

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Відмітка виконаного завдання
export const toggleTaskCompletion = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            console.log(`Task not found with id: ${id}`);
            return res.status(404).json({ message: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        res.status(200).json({ message: "Task completion status updated", task });
    } catch (error) {
        console.error("Error toggling task completion:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};