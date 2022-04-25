const express = require('express');
const transactioRoutes = express.Router();
const { postTransaction, getAllTransactions } = require('../controllers/TransactionController');

transactioRoutes.get('/transactions/all', getAllTransactions);
transactioRoutes.post('/transactions/new', postTransaction);

module.exports = transactioRoutes;