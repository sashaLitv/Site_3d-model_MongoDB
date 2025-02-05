import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    name: { type: String, required: false },
    date_of_birth: { type: Date, required: false }
});

const User = mongoose.model('User', userSchema);
export default User;