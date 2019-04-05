'use strict';

const http = require('http');

module.exports = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    console.log(`${error.message} (${statusCode}: ${http.STATUS_CODES[statusCode]})`);
    res.status(statusCode);
    res.render(error.template || 'error', { error });
}
