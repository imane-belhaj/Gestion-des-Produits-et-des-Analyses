const db = require('../config/dbConfig');

const produitsService = {
    getAllProduits: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM produits', (err, results) => {
                if (err) reject('Failed to fetch products');
                resolve(results);
            });
        });
    },
};

module.exports = produitsService;
