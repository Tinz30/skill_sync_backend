const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { swaggerUi, swaggerSpec } = require('../swagger/swaggerConfig')


const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); 
app.get('/health', (req, res) => res.send('API is running'));
app.get('/skills', (req, res) => { res.json([{ id: 1, name: 'React' }, { id: 2, name: 'Node' }]) })

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected via Atlas'))
  .catch((err) => console.error('❌ DB connection error:', err));

app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Your routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

module.exports = app;