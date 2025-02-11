const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('../models/user');

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
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

Analyse.belongsTo(User, {
    foreignKey: 'user_id',
    onUpdate: 'CASCADE',
});
User.hasMany(Analyse, {
    foreignKey: 'user_id' });
module.exports = Analyse;
