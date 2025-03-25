const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Produit = require('./produitModel');
const User = require('./user');

const PlanControle = sequelize.define('PlanControle', {
    plan_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produit,
            key: 'id',
        },
        onDelete: 'CASCADE',
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
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    date_modification: {
        type: DataTypes.DATE,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'plancontroles',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
});

module.exports = PlanControle;
