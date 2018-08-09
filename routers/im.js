var express=require('express');
var router = express.Router();

var user=require('./im/user.js');
var message=require('./im/message.js');
router.use('/user',user);
router.use('/',user);
router.use('/message',message);
module.exports = router;