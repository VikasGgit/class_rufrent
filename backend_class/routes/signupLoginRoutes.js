const express = require('express');
const AuthController = require('../controllers/signupLogin');
const router = express.Router();

const authController = new AuthController();

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/g_login', (req, res) => authController.googleLogin(req, res));

module.exports = router;
