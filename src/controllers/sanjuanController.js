const {
  validationResult,
  matchedData,
} = require('express-validator');
const debug = require('debug')('sanjuanController');
const axios = require('axios');

const getSanjuanList = async (req, res) => {
  const host = getConnectionString();
  console.log('HOST: ', host);

  try {
    const response = await axios.get('/sanjuans?active=true', {
      proxy: {
        host: host,
        port: 1337,
      },
    });

    console.log(response.data);

    res.render('pages/maps', {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    });
  } catch (error) {}
};

const newSanjuanForm = async (req, res) => {
  res.render('pages/form', {
    data: {},
    errors: {},
    csrfToken: req.csrfToken(),
  });
};

// make the api call to save the data
const newSanjuanService = async (req, res) => {
  // Get connection string
  let host = getConnectionString();
  // Checks for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('pages/form', {
      data: req.body,
      errors: errors.mapped(),
      csrfToken: req.csrfToken(),
    });
  }
  const data = matchedData(req);
  // Use Axios to make the API call
  try {
    const response = await axios.post('/sanjuans', data, {
      proxy: { host: host, port: 1337 },
    });

    if (response.status == 200) {
      res.redirect(301, '/success');
    }
  } catch (error) {
    console.log(error.toString());
    res.redirect(301, '/fail');
  }
};

const getConnectionString = () => {
  require('dotenv').config();
  return process.env.CONNECTION_STRING;
};

const sanjuanController = {};
sanjuanController.getSanjuanList = getSanjuanList;
sanjuanController.newSanjuanForm = newSanjuanForm;
sanjuanController.newSanjuanService = newSanjuanService;

module.exports = sanjuanController;
