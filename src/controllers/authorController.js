const db = require('../../db');

class AuthorController {
    async getAuthors(req, res, next) {
        try {
            const authors = await db.query(
                `
                SELECT a.id, a.full_name, a.email, n.title AS nationality
                FROM authors AS a
                JOIN nationalities AS n ON a.nationality_id = n.id
                ORDER BY a.id
                `,
            );
            res.status(200).send(authors.rows);
        } catch (err) {
            next(err);
        }
    }

    async getAuthorById(req, res, next) {
        try {
            const { authorId } = req.params;
            const author = await db.query(
                `
                SELECT a.id, a.full_name, a.email, n.title AS nationality
                FROM authors AS a
                JOIN nationalities AS n ON a.nationality_id = n.id
                WHERE a.id=$1
                `,
                [authorId],
            );
            if (author.rows.length > 0) {
                res.status(200).send(author.rows[0]);
            } else {
                res.status(404).send('Author not found');
            }
        } catch (err) {
            next(err);
        }
    }

    async createAuthor(req, res, next) {
        try {
            const { full_name, email, nationality } = req.body;
            const newAuthor = await db.query(
                `
                INSERT INTO authors
                (full_name, email, nationality_id)
                VALUES 
                ($1, $2, (SELECT id FROM nationalities WHERE title=$3))
                RETURNING *
                `,
                [full_name, email, nationality],
            );
            res.status(201).send(newAuthor.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    async updateAuthor(req, res, next) {
        try {
            const { id, full_name, email, nationality } = req.body;
            const updatedAuthor = await db.query(
                `
                UPDATE authors
                SET
                full_name=$1,
                email=$2,
                nationality_id=(SELECT id FROM nationalities WHERE title=$3)
                WHERE id=$4
                RETURNING *
                `,
                [full_name, email, nationality, id],
            );
            res.status(200).send(updatedAuthor.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    async deleteAuthor(req, res, next) {
        try {
            const { authorId } = req.params;
            const delAuthor = await db.query(
                `
                DELETE FROM authors
                WHERE id=$1
                RETURNING id
                `,
                [authorId],
            );
            if (delAuthor.rows.length > 0) {
                res.status(200).send(delAuthor.rows[0]);
            } else {
                res.status(404).send('Author not found');
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthorController();
