const db = require('../../db');

class BookController {
    async getBooks(req, res, next) {
        try {
            const books = await db.query(
                `
                SELECT b.id, b.title, g.title AS genre, s.title AS shelf, b.description, b.image
                FROM books AS b
                JOIN genres AS g ON b.genre_id = g.id
                JOIN shelves AS s ON b.shelf_id = s.id
                ORDER BY b.id
                `,
            );
            res.status(200).send(books.rows);
        } catch (err) {
            next(err);
        }
    }

    async getBookById(req, res, next) {
        try {
            const { bookId } = req.params;
            const book = await db.query(
                `
                SELECT b.id, b.title, g.title AS genre, s.title AS shelf, b.description, b.image
                FROM books AS b
                JOIN genres AS g ON b.genre_id = g.id
                JOIN shelves AS s ON b.shelf_id = s.id
                WHERE b.id=$1
                `,
                [bookId],
            );
            if (book.rows.length > 0) {
                res.status(200).send(book.rows[0]);
            } else {
                res.status(404).send('Book not found');
            }
        } catch (err) {
            next(err);
        }
    }

    async createBook(req, res, next) {
        try {
            const { title, genre, shelf, description, image } = req.body;
            const newBook = await db.query(
                `
                INSERT INTO books
                (title, genre_id, shelf_id, description, image)
                VALUES 
                ($1, (SELECT id FROM genres WHERE title=$2), (SELECT id FROM shelves WHERE title=$3), $4, $5)
                RETURNING *
                `,
                [title, genre, shelf, description, image],
            );
            res.status(201).send(newBook.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id, title, genre, shelf, description, image } = req.body;
            const updatedBook = await db.query(
                `
                UPDATE books
                SET
                title=$1,
                genre_id=(SELECT id FROM genres WHERE title=$2),
                shelf_id=(SELECT id FROM shelves WHERE title=$3),
                description=$4,
                image=$5
                WHERE id=$6
                RETURNING *
                `,
                [title, genre, shelf, description, image, id],
            );
            if (updatedBook.rows.length > 0) {
                res.status(200).send(updatedBook.rows[0]);
            } else {
                res.status(404).send('Book not found');
            }
        } catch (err) {
            next(err);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { bookId } = req.params;
            const delBook = await db.query(
                `
                DELETE FROM books
                WHERE id=$1
                RETURNING id
                `,
                [bookId],
            );
            if (delBook.rows.length > 0) {
                res.status(200).send(delBook.rows[0]);
            } else {
                res.status(404).send('Book not found');
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new BookController();
