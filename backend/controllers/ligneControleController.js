const LigneControle = require('../models/ligneControleModel');
const PlanControle = require('../models/planControleModel');
const User = require('../models/user');

console.log(LigneControle.associations);

const LigneControleController = {
    getAllLignes: async (req, res) => {
        try {
            const lignes = await LigneControle.findAll({
                where: {is_active: true },
                include: [
                    { model: User,attributes: ['firstname', 'lastname']},
                    { model: PlanControle, attributes: ['nom'] },
                ]
            });

            const result = lignes.map(ligne => ({
                ligne_id: ligne.ligne_id,
                nom: ligne.nom,
                plan_id: ligne.plan_id,
                plan_nom: ligne.PlanControle.nom,
                date_creation: ligne.date_creation,
                date_modification: ligne.date_modification,
                created_by: `${ligne.User.firstname} ${ligne.User.lastname}`
            }));

            res.json(result);
        } catch (err) {
            console.error("Error fetching all lignes:", err);
            res.status(500).json({ error: 'Failed to fetch all lignes', details: err.message || err });
        }
    },

    getLignes: async (req, res) => {
        try {
            const userId = req.user.userId;
            const lignes = await LigneControle.findAll({
                where: { user_id: userId, is_active: true }
            });

            res.json(lignes);
        } catch (err) {
            console.error("Error fetching user lignes:", err);
            res.status(500).json({ error: 'Failed to fetch user lignes', details: err.message || err });
        }
    },

    createLigne: async (req, res) => {
        const { nom, plan_id } = req.body;
        const userId = req.user.userId;
        console.log("Received Data:", { nom, plan_id, userId });
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found' });
        }

        try {
            const existingLigne = await LigneControle.findOne({ where: { nom, plan_id } });
            if (existingLigne) {
                return res.status(400).json({ error: 'Ligne de contrôle already exists' });
            }

            const ligne = await LigneControle.create({
                nom,
                plan_id,
                user_id: userId,
                is_active: true,
            });

            res.status(201).json({ message: 'Ligne de contrôle created successfully', ligne });
        } catch (err) {
            console.error("Error creating ligne de contrôle:", err);
            res.status(500).json({ error: 'Failed to create ligne de contrôle', details: err });
        }
    },


    updateLigne: async (req, res) => {
        const { id } = req.params;
        const { nom, plan_id, is_active } = req.body;

        try {
            const ligne = await LigneControle.findOne({ where: { ligne_id: id} });
            if (!ligne) {
                return res.status(400).json({ error: 'Ligne de contrôle not found' });
            }

            ligne.nom = nom || ligne.nom;
            ligne.plan_id = plan_id || ligne.plan_id;
            ligne.is_active = is_active !== undefined ? is_active : ligne.is_active;
            await ligne.save();

            res.status(200).json({ message: 'Ligne de contrôle updated successfully', ligne });
        } catch (err) {
            console.error("Error updating ligne de contrôle:", err);
            res.status(500).json({ error: 'Failed to update ligne de contrôle', details: err });
        }
    },


    deleteLigne: async (req, res) => {
        const { id } = req.params;

        try {
            const ligne = await LigneControle.findOne({ where: { ligne_id: id} });
            if (!ligne) {
                return res.status(400).json({ error: 'Ligne de contrôle not found' });
            }

            await ligne.update({is_active: false, date_modification: new Date()});
            res.status(200).json({ message: 'Ligne de contrôle deleted successfully' });
        } catch (err) {
            console.error("Error deleting ligne de contrôle:", err);
            res.status(500).json({ error: 'Failed to delete ligne de contrôle', details: err });
        }
    }
};

module.exports = LigneControleController;
