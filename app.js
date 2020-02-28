const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const PORT = 3000;

//Listen to the server on port 3000
app.listen(PORT);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
if (req.method === 'OPTIONS') {
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  return res.status(200).json({});
}
next();
});

const orderRoutes = require('./api/routes/order');
const toDoRoutes = require('./api/routes/todo');

app.use('/order', orderRoutes);
app.use('/todo', toDoRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message 
    }
  });
});

module.exports = app;