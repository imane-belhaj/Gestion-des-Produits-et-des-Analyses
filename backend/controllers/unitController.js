const {Op} = require('sequelize');
const Unit = require('../models/unitModel');

const unitController = {
    getAllUnits: async (req, res) => {
        try {
            const { search } = req.query;
            let whereCondition = {};
            if (search) {
                whereCondition = {
                    nom: { [Op.like]: `%${search}%` }
                };
            }

            const units = await Unit.findAll({ where: whereCondition });
            res.json(units);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve units', details: err });
        }

    },
    createUnit: async (req, res) => {
       try {
           const {nom, symbole} = req.body;

           const existingUnit = await Unit.findOne({where: {nom}});
           if (existingUnit) {
               return res.status(400).json({error: 'Unit already exists'});
           }

           const unit = await Unit.create({nom, symbole});
           res.status(201).json({message: 'Unit created successfully', unit });

       } catch (err) {
           res.status(500).json({error: 'Failed to create unit',details:err });
       }
    }
}

module.exports = unitController;