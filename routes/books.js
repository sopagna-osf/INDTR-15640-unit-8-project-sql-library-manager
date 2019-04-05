'use strict';

const express = require('express');
const router = express.Router();
const database = require('../database/models');

// Books listing page
router.get('/', (req, res, next) => {
    const Op = database.Sequelize.Op;
    const rowPerPage = 10;
    const search = req.query.search;
    const pageNumber = parseInt(req.query.page > 0 ? req.query.page : 1);
    let pageCount = 1;
    let options = {
        limit: rowPerPage,
        offset: (pageNumber - 1) * rowPerPage,
        order: [
            ['title', 'ASC']
        ]
    };

    if (search) {
        options.where = {
            [Op.or]: {
                title: {
                    [Op.like]: `%${search}%`
                },
                author: {
                    [Op.like]: `%${search}%`
                },
                genre: {
                    [Op.like]: `%${search}%`
                },
                year: {
                    [Op.like]: `%${search}%`
                }
            }
        }
    }

    database.Book.findAndCountAll(options)
    .then(result => {
        pageCount = Math.ceil(result.count / rowPerPage);
        res.render('index', { pageTitle: 'Books', books: result.rows, pageNumber, pageCount, search });
    })
    .catch(err => {
        const error = new Error(err.message);
        next(error);
    });
});

// Show new book page
router.get('/new', (req, res) => {
    res.render('new-book', { pageTitle: 'New Book', book: {} });
});

// Create new book
router.post('/new', (req, res, next) => {
    database.Book.create(req.body, { fields: ['title', 'author', 'genre', 'year'] })
    .then(book => {
        res.redirect('/books');
    })
    .catch(err => {
        if (err.name == 'SequelizeValidationError') {
            res.render('new-book', { pageTitle: 'New Book', errors: err.errors, book: database.Book.build(req.body) });
        } else {
            throw err;
        }
    })
    .catch(err => {
        const error = new Error(err.message);
        next(error);
    });
});

// Show update book page
router.get('/:id', (req, res, next) => {
    database.Book.findByPk(req.params.id)
    .then(book => {
        if (!book) {
            throw new Error(`The book with id ${req.params.id} doesn't exist.`);
        }

        res.render('update-book', { pageTitle: book.title, book });
    })
    .catch(err => {
        const error = new Error(err.message);
        next(error);
    });
});

// Update book
router.post('/:id', (req, res, next) => {
    database.Book.findByPk(req.params.id)
    .then(book => {
        if (!book) {
            throw new Error(`The book with id ${req.params.id} doesn't exist.`);
        }

        book.update(req.body, { fields: ['title', 'author', 'genre', 'year'] })
        .then(book => {
            res.redirect('/books');
        })
        .catch(err => {
            if (err.name == 'SequelizeValidationError') {
                let book = database.Book.build(req.body);
                book.id = req.params.id;
                res.render('update-book', { pageTitle: book.title, errors: err.errors, book: book });
            } else {
                throw err;
            }
        })
        .catch(err => {
            const error = new Error(err.message);
            next(error);
        });
    })
    .catch(err => {
        const error = new Error(err.message);
        next(error);
    });
});

// Delete book
router.post('/:id/delete', (req, res, next) => {
    database.Book.findByPk(req.params.id)
    .then(book => {
        if (!book) {
            throw new Error(`The book with id ${req.params.id} doesn't exist.`);
        }

        book.destroy()
        .then(book => {
            res.redirect('/books');
        })
        .catch(err => {
            const error = new Error(err.message);
            next(error);
        });
    })
    .catch(err => {
        const error = new Error(err.message);
        next(error);
    });
});

module.exports = router;
