const {
  validationResult,
  matchedData,
} = require('express-validator');
const debug = require('debug')('sanjuanController');
const axios = require('axios');

const getSanjuanList = async (req, res) => {
  const host = getConnectionString();
  try {
    const response = await axios.get('/sanjuans?active=true', {
      proxy: {
        host: host,
        port: 1337,
      },
    });

    console.log(response.data);

    res.render('pages/maps', {
      GOOGLE_MAPS_API_KEY:
        process.env.GOOGLE_MAPS_API_KEY ||
        'AIzaSyDdTh37pLricihtuZKxqUCW0_yErzVle0s',
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
      req.flash(
        'success',
        'Gracias por los datos! En breve el evento estará disponible para todos',
      );
      res.redirect(301, '/');
    }
  } catch (error) {
    console.log(error.toString());
    res.redirect(301, '/');
  }
};

const getConnectionString = () => {
  require('dotenv').config();
  let host = '';
  switch (process.env.NODE_ENV) {
    case 'development':
      host = 'localhost';
      break;
    case 'testing':
      host = 'sanjuanapp_api';
      break;
    default:
      host = 'localhost';
  }
  return host;
};

const sanjuanController = {};
sanjuanController.getSanjuanList = getSanjuanList;
sanjuanController.newSanjuanForm = newSanjuanForm;
sanjuanController.newSanjuanService = newSanjuanService;

module.exports = sanjuanController;
