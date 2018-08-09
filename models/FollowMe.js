var mongoose = require('mongoose');
var FollowMeSchema = require('../schemas/FollowMeSchema');
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money
var FollowMe = mongoose.model('Follow_Me',FollowMeSchema);
module.exports = FollowMe;