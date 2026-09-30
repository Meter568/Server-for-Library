const db = require('../../db');

class CustomerController {
    async getCustomers(req, res, next) {
        try {
            const customers = await db.query(
                `
                SELECT id, full_name, password, email, phone
                FROM customers
                ORDER BY id
                `,
            );
            res.status(200).send(customers.rows);
        } catch (err) {
            next(err);
        }
    }

    async getCustomerById(req, res, next) {
        try {
            const { customerId } = req.params;
            const customer = await db.query(
                `
                SELECT id, full_name, password, email, phone
                FROM customers
                WHERE id=$1
                `,
                [customerId],
            );
            if (customer.rows.length > 0) {
                res.status(200).send(customer.rows[0]);
            } else {
                res.status(404).send('Customer not found');
            }
        } catch (err) {
            next(err);
        }
    }

    async createCustomer(req, res, next) {
        try {
            const { full_name, password, email, phone } = req.body;
            const newCustomer = await db.query(
                `
                INSERT INTO customers
                (full_name, password, email, phone)
                VALUES 
                ($1, $2, $3, $4)
                RETURNING *
                `,
                [full_name, password, email, phone],
            );
            res.status(201).send(newCustomer.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    async updateCustomer(req, res, next) {
        try {
            const { id, full_name, password, email, phone } = req.body;
            const updatedCustomer = await db.query(
                `
                UPDATE customers
                SET
                full_name=$1,
                password=$2,
                email=$3,
                phone=$4
                WHERE id=$5
                RETURNING *
                `,
                [full_name, password, email, phone, id],
            );
            if (updatedCustomer.rows.length > 0) {
                res.status(200).send(updatedCustomer.rows[0]);
            } else {
                res.status(404).send('Customer not found');
            }
        } catch (err) {
            next(err);
        }
    }

    async deleteCustomer(req, res, next) {
        try {
            const { customerId } = req.params;
            const delCustomer = await db.query(
                `
                DELETE FROM customers
                WHERE id=$1
                RETURNING id
                `,
                [customerId],
            );
            if (delCustomer.rows.length > 0) {
                res.status(200).send(delCustomer.rows[0]);
            } else {
                res.status(404).send('Customer not found');
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CustomerController();
