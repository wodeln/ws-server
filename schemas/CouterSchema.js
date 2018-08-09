var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var counterSchema = new Schema({
    _id:String,
    seq:Number
});
module.exports = counterSchema;