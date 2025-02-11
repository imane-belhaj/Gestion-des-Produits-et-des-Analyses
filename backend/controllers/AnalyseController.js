const db = require('../config/dbConfig');
const User = require('../models/user');
const Analyse = require('../models/analyseModel');

const analysesController = {
    getAllAnalyses:async (req,res) => {
        try {
            const analyses = await Analyse.findAll({
                where: {user_id: req.user.userId },
                include: [{
                    model:User,
                    attributes: ['firstname', 'lastname'],
                }]
            });

            const result = analyses.map(analyse => ({
                id: analyse.id,
                nom_analyse: analyse.nom_analyse,
                valeur_max: analyse.valeur_max,
                valeur_min: analyse.valeur_min,
                created_by: `${analyse.User.firstname} ${analyse.User.lastname}`,
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
        const {nom_analyse,valeur_max,valeur_min} = req.body;
        const userId = req.user.userId;
        console.log("userId from request :",userId);
        if (!userId) {
            return res.status(401).json({error: 'userId is missing'});
        }
        try {
            const existingAnalyse = await Analyse.findOne({where: {nom_analyse}});
            if (existingAnalyse) {
                return res.status(400).json({error: 'Analyse already exists'});
            }
            const analyse = await Analyse.create({
             nom_analyse,
             valeur_max,
             valeur_min,
             user_id: userId,
            });
            res.status(200).json({message:'Analsye created successfully',analyse});
        }catch(err) {
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
