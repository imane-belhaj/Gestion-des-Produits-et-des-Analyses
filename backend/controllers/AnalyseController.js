const db = require('../config/dbConfig');
const User = require('../models/user');
const Analyse = require('../models/analyseModel');
const Unit = require('../models/unitModel');

const analysesController = {
    getAllAnalyses:async (req,res) => {
        try {
            const analyses = await Analyse.findAll({
                where: {user_id: req.user.userId },
                include: [
                    {model:User, attributes: ['firstname', 'lastname'],},
                    {model: Unit, attributes: ['nom', 'symbole']}
                ]
            });

            const result = analyses.map(analyse => ({
                id: analyse.id,
                nom_analyse: analyse.nom_analyse,
                valeur_max: analyse.valeur_max,
                valeur_min: analyse.valeur_min,
                created_by: `${analyse.User.firstname} ${analyse.User.lastname}`,
                unit: analyse.Unit ? `${analyse.Unit.nom} (${analyse.Unit.symbole})` : null,
            }));

            res.json(result);
        }catch(err) {
            console.error("Dtabase query error:", err);
            res.status(500).json({error : 'Database query failed',details: err});
        }
    },

    getAllAnalysesForHome: async (req,res) => {
        try {
            const analyses = await Analyse.findAll({
                include :[{
                    model:User,
                    attributes: ['firstname', 'lastname'],
                }]
            });
            const result = analyses.map(analyse => ({
                id: analyse.id,
                nom_analyse: analyse.nom_analyse,
                created_by:`${analyse.User.firstname} ${analyse.User.lastname}`,
                valeur_max:analyse.valeur_max,
                valeur_min:analyse.valeur_min,
                date_creation:analyse.date_creation,
                date_modification:analyse.date_modification,
            }));
            res.json(result);
        } catch (error) {
            console.error("Dtabase query error:", error);
            res.status(500).json({error : 'Database query failed',details: error});
        }
    },

    createAnalyse: async (req, res) => {
        console.log("Received data:", req.body);
        const {nom_analyse,valeur_max,valeur_min,unit_id, unit_name, unit_symbol} = req.body;
        const userId = req.user.userId;
        console.log("userId from request :",userId);
        console.log("Unit ID from request:", unit_id);
        if (!userId) {
            return res.status(401).json({error: 'userId is missing'});
        }

        try {

            let unitIdToUse = unit_id;
            if (!unit_id && unit_name && unit_symbol) {
                let existingUnit = await Unit.findOne({ where: { nom: unit_name } });

                if (!existingUnit) {
                    const newUnit = await Unit.create({ nom: unit_name, symbole: unit_symbol });
                    unitIdToUse = newUnit.id;
                } else {
                    unitIdToUse = existingUnit.id;
                }
            }



            if (!unitIdToUse) {
                return res.status(400).json({ error: 'Unit information is missing' });
            }

            const existingAnalyse = await Analyse.findOne({where: {nom_analyse}});
            if (existingAnalyse) {
                return res.status(400).json({error: 'Analyse already exists'});
            }
            const analyse = await Analyse.create({
             nom_analyse,
             valeur_max,
             valeur_min,
             user_id: userId,
             date_creation: new Date(),
             date_modification: new Date(),
             unit_id: unitIdToUse,

            });
            res.status(200).json({message:'Analsye created successfully',analyse});
        }catch(err) {
            console.error("Error creating Analyse:", err);
            res.status(500).json({error: 'Failed to create Analyse',details: err});
        }
    },

    updateAnalyse: async (req, res) => {
        const {id} = req.params;
        const {nom_analyse,valeur_max,valeur_min} = req.body;
        try {
            const analyse = await Analyse.findOne({where: {id, user_id:req.user.userId}});
            if (!analyse) {
                return res.status(404).json({error: 'Analyse not found'});
            }

            analyse.nom_analyse = nom_analyse || analyse.nom_analyse;
            analyse.valeur_max = valeur_max || analyse.valeur_max;
            analyse.valeur_min = valeur_min || analyse.valeur_min;

            await analyse.save();
            res.status(201).json({message:'Analyse successfully updated',analyse});
        }catch(err) {
            console.error("error updating analyse:", err);
            res.status(500).json({error: 'Failed to update Analyse',details: err});
        }
    },
    deleteAnalyse: async (req, res) => {
        const {id} = req.params;
        try {
            const analyse = await Analyse.findOne({where : {id,user_id : req.user.userId}});
            if (!analyse) {
                return res.status(404).json({error: 'Analyse not found'});
            }
            await analyse.destroy();
            res.status(200).json({message:'Analyse successfully deleted',analyse});
        }catch(err) {
            console.error("error deleting analyse:", err);
            res.status(500).json({error: 'Failed to delete Analyse',details: err});
        }
    }
};

module.exports = analysesController;
