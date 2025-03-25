const User = require('./user');
const Unit = require('./unitModel');
const Produit = require('./produitModel');
const Analyse = require('./analyseModel');
const PlanControle = require('./planControleModel');
const LigneControle = require('./ligneControleModel');

// User - Produit
User.hasMany(Produit, { foreignKey: 'user_id' });
Produit.belongsTo(User, { foreignKey: 'user_id', onUpdate: 'CASCADE' });

// User - Analyse
User.hasMany(Analyse, { foreignKey: 'user_id' });
Analyse.belongsTo(User, { foreignKey: 'user_id', onUpdate: 'CASCADE' });

// Produit - PlanControle
Produit.hasOne(PlanControle, { foreignKey: 'produit_id', onDelete: 'CASCADE' });
PlanControle.belongsTo(Produit, { foreignKey: 'produit_id', onDelete: 'CASCADE' });

// User - PlanControle
User.hasMany(PlanControle, { foreignKey: 'user_id' });
PlanControle.belongsTo(User, { foreignKey: 'user_id' });

// PlanControle - LigneControle
PlanControle.hasMany(LigneControle, { foreignKey: 'plan_id',  onDelete: 'CASCADE' });
LigneControle.belongsTo(PlanControle, { foreignKey: 'plan_id',  onDelete: 'CASCADE' });

// User - LigneControle
LigneControle.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LigneControle, { foreignKey: 'user_id'});

// Analyse - Unit
Analyse.belongsTo(Unit, { foreignKey: 'unit_id' });
Unit.hasMany(Analyse, { foreignKey: 'unit_id' });


module.exports = { User, Produit, Analyse, PlanControle, LigneControle };