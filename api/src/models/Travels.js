const mongoose = require('mongoose');
const { Schema } = mongoose;

const travelSchema = new Schema({
    travelDate : { type: Date, default: Date.now },
    travelOrigin: { type: String, required: true },
    travelDestiny: { type: String, required: true },
    travelSuccess : { type: Boolean, required: true}
});

const Travel = mongoose.model('Travel', travelSchema);

module.exports = Travel;