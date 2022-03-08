const authentication = require('../controllers/authenticationController');
const route = require('express').Router();

route.post('/register', authentication.registerUser);

route.post('/login', authentication.login)

module.exports = route;