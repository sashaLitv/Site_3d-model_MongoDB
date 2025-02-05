import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      task_name: { type: String, required: true },
      due_date: { type: Date, required: true },
      importance: { type: String, enum: ['low', 'middle', 'high', '!high!'] },
      description: { type: String, required: false }
    }
  );

const Task = mongoose.model('Task', taskSchema);

export default Task;