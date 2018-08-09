var mongoose = require('mongoose');
var MessageSchema = require('../schemas/MessageSchema');
//创建model，这个地方的im_user对应mongodb数据库中im_users的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money

var Message = mongoose.model('Message',MessageSchema);
module.exports = Message;