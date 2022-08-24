const {Router} = require('express')
const router = Router();
const forkRandom = require('../controller/yargsController')

//router.get('/info', getInfoFromPC);

router.get('/api/randoms', forkRandom); 

module.exports = router;
