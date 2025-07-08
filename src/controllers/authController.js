const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.register=async(req,res)=>{
    const{name,email,password,role}=req.body;
    

    try {
        const existingUser = await  User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        res.status(201).json({
            message:"User created successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
}