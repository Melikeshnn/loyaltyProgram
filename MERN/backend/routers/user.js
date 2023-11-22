const express = require('express');
const {register} = require('../controllers/user.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);  //cookie sıfrılamak için kullandım.
router.post('/forgotPassword', forgotPassword);
router.post('/reset/:token', resetPassword);
router.get('/user', authenticationMind, userDetail); //admin adı gelecek.


module.exports = router;