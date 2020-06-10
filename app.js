const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const helmet = require('helmet');

require('dotenv').config();

const app = express();

// Routers import
const testRouter = require('./src/routes/testRouter');
const indexRouter = require('./src/routes/indexRouter');
const sanjuanRouter = require('./src/routes/sanjuanRouter');

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
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
// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Set ejs as the view engine
app.set('views', './public/views');
app.set('view engine', 'ejs');

// app.get('/', (req, res) => res.render('index'));
app.use('/', indexRouter);
app.use('/sanjuan', sanjuanRouter);

// app.use('/test', testRouter);
app.use((req, res) => {
  res.status(404).send('Unable to find the requested route');
});

app.listen(PORT, () => {
  debug(`Listening on port: ${PORT}`);
});
