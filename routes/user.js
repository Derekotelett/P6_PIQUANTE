const express = require('express');
const router = express.Router();
const passwordSchema = require("../middleware/passwordVerification");
const rateLimit = require ("../middleware/rateLimit")

const userCtrl = require('../controllers/user');

router.post('/signup', passwordSchema, userCtrl.signup);
router.post('/login', rateLimit, userCtrl.login);

module.exports = router;