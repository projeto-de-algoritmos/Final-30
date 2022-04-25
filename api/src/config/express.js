const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TransactionRoutes = require('../routes/TransactionRoutes');

const app = express();

app.set('port', process.env.PORT || 5000);
app.use(cors());
app.use(bodyParser.json());

app.use('/api/hello', function(req, res) {
    res.status(200).json({data: 'hello world'});
});

app.use('/api', TransactionRoutes);


module.exports = app;