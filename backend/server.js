require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticate = require('./middleware/authMiddleware');
const sequelize = require('./config/dbConfig');
require('./models/associations');


const authRoutes = require('./routes/authRoutes');
const produitsRoutes = require('./routes/produitsRoutes');
const analysesRoutes = require('./routes/analysesRoutes');
const unitRoutes = require('./routes/unitRoutes');
const planControleRoutes = require('./routes/planControleRoutes');
const ligneControleRoutes = require('./routes/ligneControleRoutes')

const server = express();

server.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));

server.use('/auth', authRoutes);
server.use('/produits', authenticate, produitsRoutes);
server.use('/analyses', authenticate, analysesRoutes);
server.use('/plans', authenticate, planControleRoutes);
server.use('/lignes',authenticate, ligneControleRoutes);
server.use('/units',authenticate, unitRoutes);

sequelize.sync({ alter: true }).then(() => console.log('Database synced.'));



server.listen(3000, function (error) {
    if (error) {
        console.log("Error ............!");
    } else {
        console.log("Server started on port 3000!");
    }
});

