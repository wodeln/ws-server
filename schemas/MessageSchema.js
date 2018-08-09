var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//创建Schema
var messageSchema = new Schema({
    from:Number,
    isUnread:Boolean,
    source:Object,
    time:Number,
    to:Number,
    type:String,
    group:Number,
    avatar:String
});
module.exports = messageSchema;