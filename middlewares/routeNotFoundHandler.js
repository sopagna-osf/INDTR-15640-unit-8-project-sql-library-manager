'use strict';

module.exports = (req, res, next) => {
    const error = new Error('Oops! Nothing was found');
    error.statusCode = 404;
    error.template = 'page-not-found';
    next(error);
}
