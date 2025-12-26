// // proxmox-axios.js
const axios = require('axios');
const https = require('https');

const PROXMOX_HOST = 
'104.21.48.84'
// 'proxmox.dnggnd.online';
const TOKEN_ID = 'apiuser@pve!vpsapi';
const TOKEN_SECRET = '055b1ca3-cc9c-403a-b21f-8e6b1d90eff6';

const api = axios.create({
  baseURL: `https://${PROXMOX_HOST}:8006/api2/json`,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // bỏ kiểm tra SSL self-signed
  headers: {
    // 'Authorization': `PVEAPIToken=${TOKEN_ID}=${TOKEN_SECRET}`
    'Authorization': `PVEAPIToken=apiuser@pve!vpsapi=055b1ca3-cc9c-403a-b21f-8e6b1d90eff6`
  }
});

(async () => {
  try {
    const res = await api.get('/nodes');
    console.log('Nodes:', res.data.data);
  } catch (err) {
    console.error('Lỗi:', err.message);
  }
})();

