const Produit = require('../models/produitModel');
const User = require('../models/user');
const produitController = {

    getAllProduits: async (req, res) => {
        try {
            const produits = await Produit.findAll({
                where: { user_id: req.user.userId }, // Make sure you're filtering by user
                include: [{
                    model: User,  // Include the User model
                    attributes: ['firstname', 'lastname'],  // Include the necessary fields (firstname and lastname)
                }]
            });

            // "crée par"
            const result = produits.map(produit => ({
                id: produit.id,
                nom: produit.nom,
                date_creation: produit.date_creation,
                date_modification: produit.date_modification,
                // Add "crée par" field
                created_by: `${produit.User.firstname} ${produit.User.lastname}`,  // Access associated User data correctly
            }));

            res.json(result);  // Use the mapped result
        } catch (err) {
            console.error("Database query error:", err);
            res.status(500).json({ error: 'Database query failed', details: err });
        }
    },

    getAllProduitsForHome: async (req, res) => {
        try {
            const produits = await Produit.findAll({
                include: [{
                    model: User,
                    attributes: ['firstname', 'lastname'],
                }]
            });

            const result = produits.map(produit => ({
                id: produit.id,
                nom: produit.nom,
                created_by: `${produit.User.firstname} ${produit.User.lastname}`,
                date_creation: produit.date_creation,
                date_modification: produit.date_modification,
            }));

            res.json(result);
        } catch (err) {
            console.error("Database query error:", err);
            res.status(500).json({ error: 'Database query failed', details: err });
        }
    },



    createProduit: async (req, res) => {
        const { nom } = req.body;
        const userId = req.user.userId;
        console.log("User ID from request:", userId);
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }
        try {
            const existingProduit = await Produit.findOne({where: {nom }});
            if (existingProduit) {
                return res.status(400).json({ error: 'Product already exists' });
            }

            const produit = await Produit.create({
                nom,
                user_id: userId,
            });
            res.status(201).json({ message: 'Product created successfully', produit });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create product', details: err });
        }
    },
    updateProduit: async (req, res) => {
        const { id } = req.params;
        const { nom } = req.body;
        try {
            const produit = await Produit.findOne({ where: { id, user_id: req.user.userId } });
            if (!produit) {
                return res.status(400).json({ error: 'Product not found' });
            }

            produit.nom = nom || produit.nom;
            await produit.save();
            res.status(201).json({ message: 'Product updated successfully', produit });

        }catch(err) {
            console.error("Error updating produit", err);
            res.status(500).json({ error: 'Failed to update produit', details: err });
        }
    },

    deleteProduit: async (req, res) => {
        const { id } = req.params;
        try {
            const produit = await Produit.findOne({where: {id,user_id : req.user.userId}});
            if (!produit) {
                return res.status(400).json({ error: 'Product not found' });
            }
            await produit.destroy();
            res.status(200).json({ message: 'Product deleted successfully' });
        }catch(err) {
            console.error("Error deleting produit", err);
            res.status(500).json({ error: 'Failed to delete produit', details: err });
        }
    }


};

module.exports = produitController;
