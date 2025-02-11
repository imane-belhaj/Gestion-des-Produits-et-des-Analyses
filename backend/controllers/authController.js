require('dotenv').config();
const authMiddleware = require('../middleware/authMiddleware')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



const authController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error', details: err });
        }
    },
    register: async (req, res) => {
        const { firstname, lastname, email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            });

            res.status(201).json({ message: 'User registered successfully', userId: user.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error', details: err });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
                console.log('Email:', email);


                if (typeof email !== 'string') {
                    return res.status(400).json({ error: 'Email must be a string' });
                }
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const token = jwt.sign(
                { userId: user.userId, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                    token,
                    user: {
                        userId: user.userId,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                    }
            }
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error', details: err });
        }
    },

    updateProfile: async (req, res) => {

        try {
            const {userId} = req.user;
            const { firstname, lastname, email, password } = req.body;

            const user =await User.findOne({where : {userId}});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (firstname) user.firstname = firstname;
            if (lastname) user.lastname = lastname;
            if (email) user.email = email;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            await user.save();

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    userId: user.userId,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error', details: err });
        }
    },
};

module.exports = authController;
