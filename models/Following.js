var mongoose = require('mongoose');
var FollowingSchema = require('../schemas/FollowingSchema');
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money
var Following = mongoose.model('Following',FollowingSchema);
module.exports = Following;