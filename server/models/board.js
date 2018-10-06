const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var boardSchema = new Schema({
    _id: Schema.ObjectId,
    deck: [{ name: String, color: String }],
    battlefield: [{name: String, color: String}],
    graveyard: [{name: String, color: String}],
    exile: [{name: String, color: String}],
    hand: [{name: String, color: String}]
})

var Board = mongoose.model('Board', boardSchema);

module.exports = Board;