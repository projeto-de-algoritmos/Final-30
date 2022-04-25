const Transaction = require('../models/Transactions');

const postTransaction = async (req, res) => {
    const { 
        transactionType,
        transactionValue
    } = req.body;

    const transaction = new Transaction({
        transactionType,
        transactionValue
    });

    try {
        const transactionsaved = await transaction.save();
        return res.status(200).json({ 
            message: 'Transação salva com sucesso!',
            data: { transaction: transactionsaved }
        });
    } catch (error) {
        return res.status(400).json({ 
            message: 'Houve um problema ao salvar a transação.',
            errorMessage: error
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();     
        return res.status(200).json({ 
            message: 'Transações recuperadas com sucesso! ',
            data: { transactions }
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Houve um problema ao recuperar as transações.',
            errorMessage: error
        });
    }
};

module.exports = { postTransaction, getAllTransactions };