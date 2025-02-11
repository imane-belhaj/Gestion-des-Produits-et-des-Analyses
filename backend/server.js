require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticate = require('./middleware/authMiddleware');

const sequelize = require('./config/dbConfig');
require('./models/user');
require('./models/produitModel');
require('./models/analyseModel');

const server = express();

const produitsRoutes = require('./routes/produitsRoutes');
const analysesRoutes = require('./routes/analysesRoutes');
const authRoutes = require('./routes/authRoutes');

server.use(cors());
server.use(bodyParser.json());

server.use('/auth', authRoutes);
server.use('/produits', authenticate, produitsRoutes);
server.use('/analyses', authenticate, analysesRoutes);

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });


server.listen(3000, function (error) {
    if (error) {
        console.log("Error ............!");
    } else {
        console.log("Server started on port 3000!");
    }
});

