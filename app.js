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
const flash = require('connect-flash');

require('dotenv').config();

const app = express();

// Routers import
const testRouter = require('./src/routes/testRouter');
const indexRouter = require('./src/routes/indexRouter');

const PORT = process.env.PORT || 3001;
const sessionStore = new session.MemoryStore();

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 } }));
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
    check('operating_hours_string')
      .isLength({ min: 5, max: 100 })
      .withMessage('Ingrese un horario válido'),
    check('address').isLength(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/form', {
        data: req.body,
        errors: errors.mapped(),
      });
    }

    const data = matchedData(req);
    //Add the data to the db
    try {
      const response = await axios.post('/sanjuans', data, {
        proxy: { host: 'sanjuanapp_api', port: 1337 },
      });

      req.flash(
        'success',
        'Muchisimas gracias por la info! En breve los datos del San Juan se encontraran disponibles en la app',
      );

      // res.json(req.flash('success'));
      res.render('pages/index', { flash: req.flash('success') });
    } catch (error) {
      res.json({ message: 'hule m3n', error: error.toString() });
    }
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
