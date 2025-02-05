// import Task from '../models/Task.js'; 

// Створення завдання
export const createTask = async (req, res) => {
    try {
        const { task_name, due_date, importance, description } = req.body;

        const newTask = new Task({
            task_name,
            due_date,
            importance,
            description,
            user_id: req.user.id,
        });

        await newTask.save();
        res.status(201).json({ message: "Task created", task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Редагування завдання
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task_name, due_date, importance, description } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can not edit this task" });
        }

        task.task_name = task_name || task.task_name;
        task.due_date = due_date || task.due_date;
        task.importance = importance || task.importance;
        task.description = description || task.description;

        await task.save();
        res.status(200).json({ message: "Task updated", task });
    } catch (error) {
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

        if (task.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can not delete this task" });
        }

        await task.remove();
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};