const express = require('express');
const indexRouter = express.Router();
const indexController = require('../controllers/indexController');

indexRouter.route('/').get(indexController.getIndex);

module.exports = indexRouter;
