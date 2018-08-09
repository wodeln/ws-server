const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const counterSchema = new Schema({
    _id: String,
    seq: Number
});
const counter = mongoose.model('im_counter', counterSchema, 'im_counter');

getNextSequence = (name) => {
    return counter.findOneAndUpdate(
        {_id: name},
        {$inc: {seq: 1}},
        {new: true}
    ).exec()
}

exports.getNextSequence = getNextSequence;