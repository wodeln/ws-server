var mongoose = require('mongoose');
var CounterSchema = require('../schemas/CouterSchema');
//创建model，这个地方的im_user对应mongodb数据库中ch_users的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money

var Counter = mongoose.model('im_counters',CounterSchema);
module.exports = Counter;