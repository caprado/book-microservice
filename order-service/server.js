const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();

// Database connection
const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres'
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    
    sequelize.sync()
      .then(() => console.log('Tables created...'))
      .catch(err => console.error('Unable to create tables:', err));
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', orderRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = sequelize;
