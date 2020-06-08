const debug = require('debug')('app:testController');
const axios = require('axios');

const getTest = async (req, res) => {
  // res.render('index');
  try {
    debug('LLEGO CONTROLLER');
    let response = await axios.get('/sanjuans', {
      proxy: { host: 'sanjuanapp_api', port: 1337 },
    });
    debug(`Response: ${response.data}`);
    const options = {
      title: 'San Juan App',
      response: response.data,
    };
    res.render('index', options);
  } catch (e) {
    debug(e.stack);
    res.status(500).send('Server error 500');
  }
};

const testController = {};
testController.getTest = getTest;

module.exports = testController;
