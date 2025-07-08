const mongoose = require('mongoose');
const user = require('../src/models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then(
async()=>{
    const hashed = await bcrypt.hash('password123',10);
    constuser = await user.create({
        name:"First User",
        email:"firstuser@gmail.com",
        password:hashed,
        role:'Developer'
    });
    console.log("User created successfully");
    process.exit();
}
)
.catch((err)=>console.error("DB error",err));