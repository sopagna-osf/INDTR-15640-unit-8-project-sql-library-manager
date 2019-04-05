'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const portNumber = 3000;
const mainRoutes = require('./routes');
const bookRoutes = require('./routes/books');
const routeNotFoundHandler = require('./middlewares/routeNotFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

app.set('view engine', 'pug');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/static', express.static('public'));
app.use('/', mainRoutes);
app.use('/books', bookRoutes);

// Error Handlers
app.use(routeNotFoundHandler);
app.use(errorHandler);

// Server listening port
app.listen(portNumber);
console.log(`This application is listening to port ${portNumber}`);
