const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const PlanControle = require('./planControleModel');
const User = require('./user');

const LigneControle = sequelize.define('LigneControle', {
    ligne_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PlanControle,
            key: 'plan_id',
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
    tableName: 'lignecontroles',
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification',
});

module.exports = LigneControle;
