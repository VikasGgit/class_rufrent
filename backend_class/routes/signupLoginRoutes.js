const express = require('express');
const AuthController = require('../controllers/signupLogin');
const router = express.Router();

const authController = new AuthController();

router.post('/signup', (req, res) => authController.signup(req, res));

router.post('/login', (req, res) => authController.login(req, res));

router.post('/signup', (req, res) => authController.signup(req, res));

router.post('/block/:uid', (req, res) => authController.blockUser(req, res));
router.post('/unblock/:uid', (req, res) => authController.unblockUser(req, res));

module.exports = router;
