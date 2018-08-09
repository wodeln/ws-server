var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//创建Schema
var userSchema = new Schema({
    user_nickname:String,
    user_mobile:String,
    user_email:String,
    user_password:String,
    user_avatar:String,
    user_age:Number,
    user_sex:String,
    user_province:String,
    user_city:String,
    user_id:Number,
    user_stata_message:String
});
module.exports = userSchema;