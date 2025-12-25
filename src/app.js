const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const qrRouter = require('./routes/qr');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'QR API' }));

app.use('/qr', qrRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// error handler
app.use(errorHandler);

module.exports = app;
