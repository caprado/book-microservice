const { Sequelize } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../../.env' });

const sequelize = new Sequelize(
  process.env.ORDER_DB_NAME,
  process.env.ORDER_DB_USER,
  process.env.ORDER_DB_PASSWORD,
  {
    host: process.env.ORDER_DB_HOST,
    port: process.env.ORDER_DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
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

module.exports = sequelize;
