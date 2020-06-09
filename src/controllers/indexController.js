const debug = require('debug')('app:indexController');
const axios = require('axios');

const getIndex = async (req, res) => {
  res.render('pages/index');
};

const indexController = {};
indexController.getIndex = getIndex;

module.exports = indexController;
