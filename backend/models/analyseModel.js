const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./user');
const Unit = require('./unitModel');

const Analyse = sequelize.define('Analyse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom_analyse: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    valeur_max: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    valeur_min: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    date_modification: {
        type: DataTypes.DATE,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId',
        },
        onDelete: 'CASCADE',
    },
    unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Unit,
            key: 'id',
        }
    },

}, {
    timestamps: true,
    tableName:"analyses",
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
});

module.exports = Analyse;