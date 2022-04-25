const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionTypeEnum = {
    sales: 'SALE',
    travel: 'TRAVEL'
}

const transactionSchema = new Schema({
    transactionType : { 
        type: String,
        enum: Object.values(transactionTypeEnum),
        required: true
    },
    transactionValue: { type: Number, required: true },
    transactionDate : { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;