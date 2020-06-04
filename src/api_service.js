const axios = require('axios').default;
const debug = require('debug')('app:api_service');

const BASE_URL = 'http://localhost:3000';

const sanjuanIndex = () => {
  console.log(`FETCHING FROM: ${BASE_URL}`);
  axios
    .get(`${BASE_URL}`, {
      proxy: { host: '127.0.0.1', port: 3000 },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((e) => {
      console.log(`ERROR: ${e}`);
      return e;
    });
};

sanJuanService = {};
sanJuanService.sanJuanIndex = sanjuanIndex;

module.exports = sanJuanService;
