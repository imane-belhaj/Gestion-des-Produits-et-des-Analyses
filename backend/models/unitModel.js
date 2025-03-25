const  {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    symbole: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{timestamps: false,
});

module.exports = Unit;
