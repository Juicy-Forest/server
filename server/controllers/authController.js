const authController = require('express').Router();
const { body, validationResult } = require('express-validator');
const { getByUserId } = require('../services/userService');

const { register, login, logout, getUserByUsername, updateUserPassword } = require('../services/userService');
const { parseError } = require('../util/parser');


//HOME PAGE

authController.get('/', async (req, res) => {
    const user = req.user;
    if (user) {
        res.status(200).json(user)
    }
})

//REGISTER LOGIC

authController.post('/register',
    async (req, res) => {
        try {
            const token = await register(req.body.username, req.body.email, req.body.password);
            res.status(201).json({accessToken: token.accessToken, message: "user logged in."});
        } catch (error) {
            console.log(error);
            res.status(400).json({error:error.message})
        }
    })

//LOGIN LOGIC

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.status(201).json({accessToken: token.accessToken, message: "user logged in."});
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//LOGOUT LOGIC

authController.get('/logout', async (req, res) => {
    const token = req.token;
    await logout(token);
    res.status(204).end();
})

//CHANGE PASSWORD LOGIC
authController.post('/changePassword', async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { newPassword } = req.body;

        if (!newPassword || newPassword.trim().length === 0) {
            return res.status(400).json({ error: "New password is required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        await updateUserPassword(user._id, newPassword);
        
        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Password change failed" });
    }
})

module.exports = authController;
