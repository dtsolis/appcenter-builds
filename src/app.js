const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config');
const middlewares = require('./middleware');
const app = express();

app.use(logger('dev'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// include routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const webRoutes = require('./routes/web');
app.use('/', middlewares.requiresLogin, webRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  var status = err.status || '500';
  res.status(status);
  console.log(err);

  if (req.path.startsWith('/api')) {
    res.json({
      status: status,
      message: err.message
    });
  } else {
    res.render('error', {
      title: 'Error',
      message: err.message,
      error: {}
    });
  }
});

// listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express application -> ${config.serverURL}:${port}`);
});
