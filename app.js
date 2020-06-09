const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  check,
  validationResult,
  matchedData,
} = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

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
app.use(cookieParser());
app.use(
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash());

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
app.post(
  '/captcha',
  [
    check('name')
      .isLength({ min: 5, max: 100 })
      .withMessage('Ingrese un nombre válido'),
    check('contact')
      .isLength({ min: 10, max: 10 })
      .withMessage('Ingrese un contacto válido'),
    check('description')
      .isLength({ min: 10 })
      .withMessage('Ingrese una descripción válida'),
    check('opening_hours')
      .isLength({ min: 5, max: 100 })
      .withMessage('Ingrese un horario válido'),
    check('address').isLength(),
  ],
  async (req, res) => {
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/form', {
        data: req.body,
        errors: errors.mapped(),
      });
    }

    const data = matchedData(req);
    console.log('DATA: ', data);
    //Add the data to the db

    req.flash(
      'success',
      'Gracias! En breve en el San Juan estará disponible para todos',
    );

    res.redirect('/');
  },
);
app.use('/test', testRouter);

// app.get('/maps', (req, res) => {
//   res.render('maps', {
//     GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
//   });
// });

app.listen(PORT, () => {
  debug(`Listening on port: ${PORT}`);
});
