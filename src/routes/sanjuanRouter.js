const express = require('express');
const sanjuanController = require('../controllers/sanjuanController');
const sanjuanRouter = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const { check } = require('express-validator');
// /sanjuan <--- our path

sanjuanRouter.use(csrfProtection);

sanjuanRouter.route('/').get(sanjuanController.getSanjuanList);

sanjuanRouter.route('/new').get(sanjuanController.newSanjuanForm);

sanjuanRouter.post(
  '/',
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
  sanjuanController.newSanjuanService,
);

module.exports = sanjuanRouter;
