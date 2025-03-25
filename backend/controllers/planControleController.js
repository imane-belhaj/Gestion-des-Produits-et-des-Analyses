const PlanControle = require('../models/planControleModel');
const Produit = require('../models/produitModel');
const User = require('../models/user');
const LigneControle = require('../models/ligneControleModel');

const PlanControleController = {
    getAllPlans: async (req, res) => {
        try {
            const plans = await PlanControle.findAll({
                where: { is_active: true },
                include: [
                    {model: User, attributes: ['firstname', 'lastname']},
                    {model: Produit, attributes: ['nom']}
                ]
            });

            const result = plans.map(plan => ({
                plan_id: plan.plan_id,
                nom: plan.nom,
                produit_id: plan.produit_id,
                produit_nom: plan.Produit.nom,
                date_creation: plan.date_creation,
                date_modification: plan.date_modification,
                created_by: `${plan.User.firstname} ${plan.User.lastname}`,
            }));

            res.json(result);
        } catch (err) {
            console.error("Error fetching all plans:", err);
            res.status(500).json({ error: 'Failed to fetch all plans', details: err.message || err });
        }
    },

    getPlans: async (req, res) => {
        try {
            const userId = req.user.userId;
            const plans = await PlanControle.findAll({
                where: { user_id: userId, is_active: true }
            });

            res.json(plans);
        } catch (err) {
            console.error("Error fetching user plans:", err);
            res.status(500).json({ error: 'Failed to fetch user plans', details: err.message || err });
        }
    },

    createPlan: async (req, res) => {
        const { nom, produit_id } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID not found' });
        }
        try {
            const produit = await Produit.findOne({ where: { id: produit_id } });
            if (!produit) {
                return res.status(400).json({ error: 'Product not found' });
            }

            const existingPlan = await PlanControle.findOne({ where: { produit_id, is_active: true } });
            if (existingPlan) {
                return res.status(400).json({ error: 'Plan already exists for this product' });
            }

            const plan = await PlanControle.create({
                nom,
                produit_id,
                user_id: userId,
                is_active: true
            });
            res.status(201).json({ message: 'Plan created successfully', plan });
        } catch (err) {
            console.error("Error creating plan:", err);
            res.status(500).json({ error: 'Failed to create plan', details: err });
        }
    },

    updatePlan: async (req, res) => {
        const { id } = req.params;
        const { nom, produit_id } = req.body;
        try {
            const plan = await PlanControle.findOne({ where: { plan_id: id, is_active: true } });
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }
            plan.nom = nom ?? plan.nom;
            plan.produit_id = produit_id ?? plan.produit_id;
            plan.date_modification = new Date();
            await plan.save();
            res.status(200).json({ message: 'Plan updated successfully', plan });
        } catch (err) {
            console.error("Error updating plan:", err);
            res.status(500).json({ error: 'Failed to update plan', details: err.message });
        }
    },

    deletePlan: async (req, res) => {
        const { id } = req.params;
        try {
            const plan = await PlanControle.findOne({ where: { plan_id: id,is_active: true } });
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }

            await PlanControle.update(
                { is_active: false, date_modification: new Date() },
                { where: { plan_id: id } }
            );

            await LigneControle.update(
                { is_active: false, date_modification: new Date() },
                { where: { plan_id: id } }
            );

            res.json({ message: 'Plan and associated lignes de contrôle soft deleted successfully' });
        } catch (err) {
            console.error("Error deleting plan:", err);
            res.status(500).json({ error: 'Failed to delete plan', details: err.message });
        }
    }
};

module.exports = PlanControleController;
