const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

// Routers import
const testRouter = require('./src/routes/testRouter');
const indexRouter = require('./src/routes/indexRouter');

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Set ejs as the view engine
app.set('views', './public/views');
app.set('view engine', 'ejs');

// app.get('/', (req, res) => res.render('index'));
app.use('/', indexRouter);

app.get('/captcha', (req, res) => {
  res.render('pages/form', {
    data: {},
    errors: {},
  });
});
app.post('/captcha', async (req, res) => {
  // const secretKey = '6Le7WQEVAAAAANNcTzfWK7OhHtnL8PwaMKWdH7zU';

  // if (
  //   req.body['g-recaptcha-response'] === undefined ||
  //   req.body['g-recaptcha-response'] === '' ||
  //   req.body['g-recaptcha-response'] === null
  // ) {
  //   return res.json({
  //     responseCode: 1,
  //     responseDesc: 'Please select captcha',
  //   });
  // }

  // const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&amp;response=${req.body['g-recaptcha-response']}&amp;remoteip=${req.connection.remoteAddress}`;

  res.render('pages/form', {
    data: req.body,
    errors: {
      name: {
        msg: 'Ingrese un nombre valido',
      },
      description: {
        msg: 'Ingrese una descripcion valida',
      },
      opening_hours: {
        msg: 'Ingrese una hora valida',
      },
      contact: {
        msg: 'Ingrese un contacto valido',
      },
      address: {
        msg: 'Ingrese una direccion válida',
      },
    },
  });
});
app.use('/test', testRouter);

// app.get('/maps', (req, res) => {
//   res.render('maps', {
//     GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
//   });
// });

app.listen(PORT, () => {
  debug(`Listening on port: ${PORT}`);
});
