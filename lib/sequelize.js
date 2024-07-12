const { Sequelize } = require('sequelize')
const setupModels = require('../DB/models');

const USER = encodeURIComponent(process.env.USER_NAME)
const PASSWORD = encodeURIComponent(process.env.PASSWORD)

const URI = `postgres://${USER}:${PASSWORD}@${process.env.HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`

console.log(URI);

const sequelize = new Sequelize(URI, {
    dialect: process.env.DIALECT,
    // dialectOptions: {
    //   ssl: process.env.SSL
    // },
    // logging: process.env.LOGGING,
  });

setupModels(sequelize);
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully...');
  }).catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize