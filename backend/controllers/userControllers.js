import User from '../models/User.js'; 
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { username, password, name, date_of_birth } = req.body;


    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            console.log("User already exists:", userExists);
            return res.status(400).json({ message: 'A user with this login already exists' });
        }

        const user = new User({
            username,
            password,
            name: name || null,
            date_of_birth: date_of_birth || null
        });

        await user.save();

        res.status(201).json({ message: 'User successfully registered' });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            console.log("No user found with username:", username);
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        if (user.password !== password) {
            console.log("Password mismatch for user:", username);
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};