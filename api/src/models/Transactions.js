const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    transactionValue: { type: Number, required: true },
    transactionDate : { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;