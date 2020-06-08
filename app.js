const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const axios = require('axios');
const http = require('http');

require('dotenv').config();

const app = express();

// Routers import
const testRouter = require('./src/routes/testRouter');
const indexRouter = require('./src/routes/indexRouter');

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(morgan('tiny'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Set ejs as the view engine
app.set('views', './public/views/pages');
app.set('view engine', 'ejs');

// app.get('/', (req, res) => res.render('index'));
app.get('/', indexRouter);

app.use('/test', testRouter);

// app.get('/maps', (req, res) => {
//   res.render('maps', {
//     GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
//   });
// });

app.listen(PORT, () => {
  debug(`Listening on port: ${PORT}`);
});
