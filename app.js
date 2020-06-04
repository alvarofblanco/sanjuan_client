const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const axios = require('axios');
const http = require('http');

const sanJuanService = require('./src/api_service');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

// Middlewares
app.use(morgan('tiny'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Set ejs as the view engine
app.set('views', './public/views/pages');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let url = '';

  switch (process.env.NODE_ENV) {
    case 'development':
      url = 'sanjuanapp_api_1';
      break;
    case 'test':
      url = 'localhost';
      break;
    default:
      url = 'localhost';
  }
  (async function () {
    try {
      let response = await axios.get('/', {
        proxy: { host: url, port: 3000 },
      });
      const options = {
        title: 'San Juan App',
        response: response.data,
      };
      res.render('index', options);
    } catch (e) {
      debug(e.stack);
      res.status(500).send('Server error 500');
    }
  })();
});

app.get('/maps', (req, res) => {
  res.render('maps', {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  });
});

app.listen(PORT, () => {
  debug(`Listening on port: ${PORT}`);
});
