const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('../models/User');

const Produit = sequelize.define('Produit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

Produit.belongsTo(User, {
    foreignKey: 'user_id',
    onUpdate: 'CASCADE',
});
User.hasMany(Produit, {
    foreignKey: 'user_id' });

module.exports = Produit;
