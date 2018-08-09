var mongoose = require('mongoose');
var UserSchema = require('../schemas/UserSchema');
//创建model，这个地方的im_user对应mongodb数据库中im_users的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money

var User = mongoose.model('User',UserSchema);
module.exports = User;