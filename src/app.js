var routes = require('./routes/router');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());

morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

app.use(cors());

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error('Global error handling:', err.message);

  let message = err.statusCode ? err.message : 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).send(message);
});

process.on('uncaughtException', (err, origin) => {
  console.log('Caught exception:', err, '\n', 'Exception origin:' + origin);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, '\n', 'reason:', reason);
});

app.listen(3000);
