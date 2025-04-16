const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getProfile, sendConnectionRequest, acceptConnection, getAllUsers, getconnectionsforuser } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.post('/connect', auth, sendConnectionRequest);
router.post('/accept', auth, acceptConnection);
router.get('/getAllUsers',getAllUsers);
router.get('/getconnectionsforuser',getconnectionsforuser)

module.exports = router;
