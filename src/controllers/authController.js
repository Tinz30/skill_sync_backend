const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;


    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        //check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //generate JWT
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        //send response
        res.status(200).json(
            {
                message: "Login successful",
                user: {
                    id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role
                },
                token
            }
        )
    } catch (error) {
        res.status(500).json({ message: "Login Failed", error: error.message })
    }
}