const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestion_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;