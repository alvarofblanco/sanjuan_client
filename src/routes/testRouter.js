const express = require('express');
const testRouter = express.Router();
const testController = require('../controllers/testController');

testRouter.route('/').get(testController.getTest);

module.exports = testRouter;
