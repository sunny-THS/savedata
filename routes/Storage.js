const storageController = require('../controllers/storageController');
const middlewareController = require('../controllers/middlewareController');
const route = require('express').Router();

route.post('/uploadFile', middlewareController.verifyToken, storageController.saveFiles);

route.post('/getFile', middlewareController.verifyToken, storageController.getFile);

route.post('/', middlewareController.verifyToken, storageController.getStorage);

module.exports = route;